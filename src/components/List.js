import React, {useContext, useEffect, useState} from 'react';
import {
    ListGroup,
    Pagination,
    Form,
    Row,
    Col,
    Button
} from 'react-bootstrap';
import { ViewerContext } from "../context/ContextWrapper";

const LIST_STEP = 10;

const List = () => {
    const [state, setState] = useContext(ViewerContext);

    const [activePageNumber, setActivePageNumber] = useState(0);
    const [pageNumbers, setPageNumbers] = useState([]);
    const [splitList, setSplitList] = useState([]);
    const [listItemEditMode, setListItemEditMode] = useState(false);
    const [currentEditInput, setCurrentEditInput] = useState(0);
    const [editedInputText, setEditedInputText] = useState('');

    const [activeButtonNum, setActiveButtonNum] = useState(0);

    const {
        list
    } = state;

    const updateList = (updatedList) => {
        setState(prevState => {
            return {
                ...prevState,
                list: updatedList
            }
        })
        localStorage.setItem('list', JSON.stringify(updatedList));
    }

    const editListItem = (e, index, initialValue) => {
        setListItemEditMode(true);
        setCurrentEditInput(index);
        setEditedInputText(initialValue);
    }

    const onInputChangeHandler = (e) => {
        setEditedInputText(e.target.value);
    }

    const saveEditedText = (e, index) => {
        e.preventDefault();
        const updatedList = list.slice();
        updatedList[activePageNumber + index].text = editedInputText;
        setListItemEditMode(false);
        setEditedInputText('');
        updateList(updatedList);
    }

    const deleteItem = (e, index) => {
        const updatedList = list.slice();
        updatedList.splice(index, 1);
        updateList(updatedList);
    }

    useEffect(() => {
        const storageList = localStorage.getItem('list');
        if (storageList) {
            setState(prevState => {
                return {
                    ...prevState,
                    list: JSON.parse(storageList)
                }
            })
        } else {
            fetch('https://cat-fact.herokuapp.com/facts/random?amount=100')
                .then(res => {
                    return res.json()
                })
                .catch(err => {
                    console.log(err, 'error while downloading cat facts :(')
                })
                .then(res => {
                    const list = res.map(quote => ({
                        text: quote.text
                    }))
                    setState(prevState => {
                        return {
                            ...prevState,
                            list: list
                        }
                    })
                    localStorage.setItem('list', JSON.stringify(list));
                })
        }
    }, []);

    useEffect(() => {
        if (list.length) {
            const newSplitList = list
                .slice()
                .map((item, i, arr) => arr.splice(0, 10))
                .filter(item => item);
            setSplitList(newSplitList);

            const pageNums = list.length / LIST_STEP;
            let items = [];
            for (let number = 0; number < pageNums; number++) {
                items.push(
                    <Pagination.Item
                        key={number}
                        active={number === activePageNumber}
                        onClick={() => setActivePageNumber(number)}
                    >
                        {number + 1}
                    </Pagination.Item>,
                );
            }
            setPageNumbers(items);
        }
    }, [list, activePageNumber]);

    return (
        <>
            <ListGroup>
                {splitList[activePageNumber]?.map((quote, index) =>
                    <ListGroup.Item
                      key={index + quote.text}
                      onDoubleClick={(e) => editListItem(e, index, quote.text)}
                      onClick={() => setActiveButtonNum(index)}
                      active={activeButtonNum === index}
                    >
                        {listItemEditMode && currentEditInput === index ?
                            <Form onSubmit={(e) => saveEditedText(e, index)}>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter new text"
                                  value={editedInputText}
                                  onChange={(e) => onInputChangeHandler(e)}
                                />
                            </Form>
                        : <Row>
                              <Col>
                                  {quote.text}
                              </Col>
                              {activeButtonNum === index &&
                                  <Col sm={2}>
                                      <Button
                                        variant="danger"
                                        onClick={(e) => deleteItem(e, index)}
                                      >
                                          Delete
                                      </Button>
                                  </Col>
                              }
                          </Row>}

                    </ListGroup.Item>
                )}
            </ListGroup>
            <Pagination>
                {pageNumbers}
            </Pagination>
        </>
    );
}

export default List;