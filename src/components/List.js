import React, {useContext, useEffect, useState} from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Pagination from 'react-bootstrap/Pagination';
import { ViewerContext } from "../context/ContextWrapper";

const LIST_STEP = 10;

const List = () => {
    const [state, setState] = useContext(ViewerContext);

    const [activePageNumber, setActivePageNumber] = useState(0);
    const [pageNumbers, setPageNumbers] = useState([]);
    const [splitList, setSplitList] = useState([]);

    const {
        list
    } = state;

    useEffect(() => {
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
            })
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
            <Pagination>
                {pageNumbers}
            </Pagination>
            <ListGroup>
                {splitList[activePageNumber]?.map(quote =>
                    <ListGroup.Item key={quote.text}>{quote.text}</ListGroup.Item>
                )}
            </ListGroup>
        </>
    );
}

export default List;