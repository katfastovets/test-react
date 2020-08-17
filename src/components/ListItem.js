import React, {useState} from 'react';
import {
  Button,
  Col,
  Form,
  ListGroup,
  Row,
} from "react-bootstrap";

const ListItem = (
  {
    isEditMode,
    text,
    onDoubleClickHandler,
    onClickHandler,
    isActive,
    onSubmitHandler,
    isDeleteButtonShown,
    onDeleteButtonClick,
    index
  }) => {
  const [inputValue, setInputValue] = useState(text);

  const onInputChangeHandler = (e) => {
    setInputValue(e.target.value);
  }

  return (
    <ListGroup.Item
      onDoubleClick={() => onDoubleClickHandler()}
      onClick={onClickHandler}
      active={isActive}
    >
      {isEditMode ?
        <Form onSubmit={(e) => onSubmitHandler(e, index, inputValue)}>
          <Form.Control
            type="text"
            placeholder="Enter new text"
            value={inputValue}
            onChange={onInputChangeHandler}
          />
        </Form>
        : <Row>
            <Col>{text}</Col>
            {isDeleteButtonShown &&
            <Col sm={2}>
              <Button
                variant="danger"
                onClick={onDeleteButtonClick}
              >
                Delete
              </Button>
            </Col>
          }
        </Row>}
    </ListGroup.Item>
  );
};

export default ListItem;
