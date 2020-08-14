import React, { useContext, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { ViewerContext } from "../context/ContextWrapper";

const List = () => {
    const [state, setState] = useContext(ViewerContext);

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

    return (
        <ListGroup>
            {list.map(quote =>
                <ListGroup.Item key={quote.text}>{quote.text}</ListGroup.Item>
            )}
        </ListGroup>
    );
}

export default List;