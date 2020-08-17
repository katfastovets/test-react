import React, { useContext, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ViewerContext } from "../../context/ContextWrapper";
import { Col, Row } from "react-bootstrap";
import './InputCreateItem.css';

const InputCreateItem = () => {
  const [state, setState] = useContext(ViewerContext);

  const { list } = state;

  const [value, setValue] = useState('');

  const onChangeHandler = (e) => {
    setValue(e.target.value);
  }

  const createNewItem = (e) => {
    e.preventDefault();
    const updatedList = list.slice();
    updatedList.unshift(value);
    setState(prevState => {
      return {
        ...prevState,
        list: updatedList,
      }
    })
    localStorage.setItem('list', JSON.stringify(updatedList));
    setValue('');
  }

  return (
    <Form
      onSubmit={(e) => createNewItem(e)}
      className={'form-add-item'}
    >
      <Row noGutters>
        <Col>
          <Form.Control
            type="text"
            placeholder="Enter new cat fact"
            value={value}
            onChange={(e) => onChangeHandler(e)}
          />
        </Col>
        <Col sm={2}>
          <Button
            block
            onClick={(e) => createNewItem(e)}
          >
            Create
          </Button>
        </Col>
      </Row>

    </Form>
  );
};

export default InputCreateItem;
