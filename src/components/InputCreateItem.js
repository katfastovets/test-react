import React, {useContext, useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ViewerContext } from "../context/ContextWrapper";

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
    updatedList.unshift({ text: value });
    console.log(updatedList)
    setState(prevState => {
      return {
        ...prevState,
        list: updatedList,
      }
    })
    localStorage.setItem('list', JSON.stringify(updatedList));
  }

  return (
    <Form onSubmit={(e) => createNewItem(e)}>
      <Form.Control
        type="text"
        placeholder="Enter new cat fact"
        value={value}
        onChange={(e) => onChangeHandler(e)}
      />
      <Button
        variant="light"
        onClick={(e) => createNewItem(e)}
      >
        Create
      </Button>
    </Form>
  );
};

export default InputCreateItem;
