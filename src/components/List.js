import React, {useContext, useEffect, useState} from 'react';
import {
    ListGroup,
    Pagination,
} from 'react-bootstrap';

import { ViewerContext } from "../context/ContextWrapper";
import ListItem from "./ListItem";
import {ReactSortable} from "react-sortablejs";

const LIST_STEP = 10;

const List = () => {
    const [state, setState] = useContext(ViewerContext);

    const [activePageNumber, setActivePageNumber] = useState(0);
    const [pageNumbers, setPageNumbers] = useState([]);
    const [splitList, setSplitList] = useState([]);
    const [sortableList, setSortableList] = useState([]);
    const [listItemEditMode, setListItemEditMode] = useState(false);
    const [currentEditInput, setCurrentEditInput] = useState(0);

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

    const editListItem = (index) => {
        setListItemEditMode(true);
        setCurrentEditInput(index);
    }

    const saveEditedText = (e, index, updatedText) => {
        e.preventDefault();
        const updatedList = list.slice();
        updatedList[activePageNumber + index] = updatedText;
        setListItemEditMode(false);
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
                    const list = res.map(quote => {
                        return quote.text
                    })
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
                .map((item, i, arr) => arr.splice(0, LIST_STEP))
                .filter(item => item);
            setSplitList(newSplitList);

            const pageNums = list.length / LIST_STEP;
            let items = [];
            for (let number = 0; number < Math.floor(pageNums); number++) {
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

    useEffect(() => {
        if (splitList.length) {
            const newSortableList = splitList[activePageNumber]?.map((item, index) => {
                return {
                    id: index,
                    name: item
                }
            })
            setSortableList(newSortableList);
        }
    }, [splitList])


    useEffect(() => {


    }, [sortableList, list, activePageNumber]);

    const updateSortedOrder = () => {
        const newUpdatedList = JSON.parse(JSON.stringify(splitList));
        newUpdatedList[activePageNumber] = sortableList.map(item => item.name);
        updateList(newUpdatedList.flat());
    }

    return (
        <>
            <ListGroup>
                {sortableList.length &&
                <ReactSortable
                  list={sortableList}
                  setList={setSortableList}
                  onEnd={() => updateSortedOrder()}
                >
                    {sortableList.map((quote, index) =>
                      <ListItem
                        key={quote.name}
                        isEditMode={listItemEditMode && currentEditInput === index}
                        text={quote.name}
                        onDoubleClickHandler={() => editListItem(index, quote.name)}
                        onClickHandler={() => setActiveButtonNum(index)}
                        isActive={activeButtonNum === index}
                        onSubmitHandler={saveEditedText}
                        isDeleteButtonShown={activeButtonNum === index}
                        onDeleteButtonClick={(e) => deleteItem(e, index)}
                        index={index}
                      />
                    )}
                </ReactSortable>
                }
            </ListGroup>
            <Pagination>
                {pageNumbers}
            </Pagination>
        </>
    );
}

export default List;