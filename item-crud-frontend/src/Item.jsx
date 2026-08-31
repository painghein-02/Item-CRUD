import { useEffect, useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

const API_URL = import.meta.env.VITE_API_URL;

export default function Item() {
  const [items, setItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newItemCategory, setNewItemCategory] = useState("");
  const newItemName = useRef(null);
  const newItemPrice = useRef(null);
  const newItemAmount = useRef(null);
  const isInit = useRef(false);

  const cols = [
    { field: "name", headerName: "Name", flex: 3 },
    { field: "category", headerName: "Category", flex: 3 },
    { field: "price", headerName: "Price", flex: 2 },
    {
      field: "actions",
      headerName: "",
      sortable: false,
      filterable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => onItemDelete(params.row._id)}>
            <DeleteIcon color="error" />
          </IconButton>
        );
      },
    },
  ];

  useEffect(() => {
    if (isInit.current) return;
    isInit.current = true;
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const fetchResult = await fetch(`${API_URL}/api/item`, { method: "GET" });
      if (fetchResult.ok) {
        const data = await fetchResult.json();
        setItems(data.itemList);
      }
    } catch (err) {
      console.error("Failed to fetch items:", err);
    }
  };

  const closeDialog = () => {
    newItemName.current.value = "";
    newItemAmount.current.value = "";
    newItemPrice.current.value = "";
    setNewItemCategory("");
    setOpenDialog(false);
  };

  const onAddItem = async () => {
    const newItem = {
      name: newItemName.current.value,
      category: newItemCategory,
      price: newItemPrice.current.value,
      amount: newItemAmount.current.value,
    };
    try {
      const addItemResult = await fetch(`${API_URL}/api/item`, {
        body: JSON.stringify(newItem),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (addItemResult.ok) {
        await loadItems();
      }
      closeDialog();
    } catch (err) {
      console.error("Failed to add item:", err);
    }
  };

  const onItemDelete = async (rowId) => {
    try {
      const deleteResult = await fetch(`${API_URL}/api/item/${rowId}`, {
        method: "DELETE",
      });
      if (deleteResult.ok) {
        await loadItems();
      }
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 px-1">
        <Typography variant="h6">Items</Typography>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          Add Item
        </Button>
      </div>
      <DataGrid rows={items} columns={cols} getRowId={(row) => row._id} />

      <Dialog open={openDialog} onClose={closeDialog} fullWidth>
        <DialogContent>
          <div style={{ marginBottom: "16px" }}>
            <Typography variant="h6">Add New Item</Typography>
          </div>
          <div className="flex flex-col gap-4">
            <TextField
              required
              id="item-name"
              label="Item Name"
              defaultValue=""
              inputRef={newItemName}
            />
            <FormControl fullWidth>
              <InputLabel id="label-item-category">Item Category</InputLabel>
              <Select
                labelId="label-item-category"
                id="item-category"
                value={newItemCategory}
                label="Item Category"
                onChange={(e) => setNewItemCategory(e.target.value)}
              >
                <MenuItem value="Appliance">Appliance</MenuItem>
                <MenuItem value="Gadget">Gadget</MenuItem>
                <MenuItem value="Headphone">Headphone</MenuItem>
              </Select>
            </FormControl>
            <TextField
              required
              id="item-price"
              label="Price"
              defaultValue=""
              inputRef={newItemPrice}
            />
            <TextField
              required
              id="item-amount"
              label="Amount"
              defaultValue=""
              inputRef={newItemAmount}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained" onClick={onAddItem}>
            Add Item
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
