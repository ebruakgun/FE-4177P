import { useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { nanoid } from "nanoid";
import Swal from "sweetalert2";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { CacheProvider } from "@emotion/react";

interface ListItemProps {
  id: string;
  content: string;
}

function App() {
  const [listInput, setListInput] = useState<string>("");
  const [listItems, setListItems] = useState<ListItemProps[]>([]);
  const [editInput, setEditInput] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const addListItem = () => {
    if (listInput.trim().length > 0) {
      const listItemId = nanoid();

      const newList = {
        id: listItemId,
        content: listInput,
      };

      // keep excising listItems and add newList too
      setListItems([...listItems, newList]);
      setListInput("");
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the input!",
        footer: '<a href="#">Why do I have this issue?</a>',
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDrag = (result: any) => {
    if (!result.destination) return;
    const items = [...listItems];
    const [removedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, removedItem);
    setListItems(items);
  };

  const handleDelete = (id: string) => {
    setListItems((items) => items.filter((item) => item.id !== id));
  };

  const handleEdit = () => {
    const selectedItem = listItems.filter((item) => item.id === selectedId);
    selectedItem[0].content = editInput;
    setOpen(false);
  };

  const handleClose = () => setOpen(false);

  const handleOpen = (id, content) => {
    setOpen(true);
    setEditInput(content);
    setSelectedId(id);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "0.10rem",
          marginTop: "15rem",
        }}
      >
        <TextField
          label="Todo"
          color="secondary"
          variant="outlined"
          type="text"
          value={listInput}
          onChange={(e) => setListInput(e.target.value)}
        />
        <Button
          sx={{
            margin: "0.3rem",
          }}
          variant="contained"
          color="secondary"
          onClick={addListItem}
        >
          Add
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "0.10rem",
          marginTop: "2rem",
        }}
      >
        <Box
          sx={{
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <h2>List</h2>
          <DragDropContext onDragEnd={handleDrag}>
            <Droppable droppableId="dragDropList">
              {(provider) => (
                <div ref={provider.innerRef} {...provider.droppableProps}>
                  {listItems.map(
                    ({ id, content }: ListItemProps, index: number) => (
                      <Draggable key={id} draggableId={id} index={index}>
                        {(provider) => (
                          <Box
                            ref={provider.innerRef}
                            {...provider.draggableProps}
                            {...provider.dragHandleProps}
                          >
                            {content}
                            {/* {provider.placeholder} */}
                            <Box
                              sx={{
                                display: "flex",
                                gap: "10px",
                              }}
                            >
                              <Button
                                onClick={() => handleOpen(id, content)}
                                variant="contained"
                                color="secondary"
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDelete(id)}
                                variant="contained"
                                color="primary"
                              >
                                Delete
                              </Button>
                            </Box>
                          </Box>
                        )}
                      </Draggable>
                    )
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Box>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <TextField
            label="Edit"
            value={editInput}
            onChange={(e) => setEditInput(e.target.value)}
          />
          <Button variant="contained" onClick={handleEdit}>
            OK
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default App;
