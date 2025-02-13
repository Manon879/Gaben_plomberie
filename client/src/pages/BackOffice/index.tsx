import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type React from "react";
import { useEffect, useState } from "react";

interface Service {
  id: number;
  title: string;
  description: string;
  picture: string;
}

const BackOfficeServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    picture: "",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/services`,
      );
      if (!response.ok) throw new Error("Failed to fetch services");
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/services/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const responseText = await response.text();

      try {
        const data = JSON.parse(responseText);

        if (response.ok) {
          setFormData((prev) => ({
            ...prev,
            picture: data.fileUrl,
          }));
          setFile(null);
        } else {
          alert(`Upload error: ${data.error}`);
        }
      } catch (jsonError) {
        console.error("Erreur de parsing JSON:", jsonError);
        alert(`Réponse non JSON: ${responseText}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };
  const handleSave = async () => {
    try {
      const method = editingService ? "PUT" : "POST";
      const url = editingService
        ? `${import.meta.env.VITE_API_URL}/api/admin/1/services/${editingService.id}`
        : `${import.meta.env.VITE_API_URL}/api/admin/1/services`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save service");
      }

      setOpenDialog(false);
      setEditingService(null);
      setFormData({ title: "", description: "", picture: "" });
      fetchServices();
      alert("Service saved successfully!");
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Failed to save service");
    }
  };

  const handleDelete = async (serviceId: number) => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/1/services/${serviceId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete service");
      }

      fetchServices();
      alert("Service deleted successfully!");
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Failed to delete service");
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      picture: service.picture,
    });
    setOpenDialog(true);
  };

  return (
    <Container>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          Add New Service
        </Button>
      </Box>

      <Stack spacing={2}>
        {services.map((service) => (
          <Card key={service.id}>
            <CardMedia
              component="img"
              image={`${import.meta.env.VITE_API_URL}/${service.picture}`}
              alt={service.title}
              style={{
                objectPosition: "center",
              }}
            />
            <CardContent>
              <Typography gutterBottom variant="h5">
                {service.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {service.description}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button onClick={() => handleEdit(service)}>Edit</Button>
                <Button color="error" onClick={() => handleDelete(service.id)}>
                  Delete
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditingService(null);
          setFormData({ title: "", description: "", picture: "" });
        }}
      >
        <DialogTitle>
          {editingService ? "Edit Service" : "Add New Service"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Fill in the service details below
          </DialogContentText>
          <Stack spacing={2}>
            <TextField
              name="title"
              label="Title"
              fullWidth
              value={formData.title}
              onChange={handleInputChange}
            />
            <TextField
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
            />
            <TextField
              name="picture"
              label="Picture URL"
              fullWidth
              value={formData.picture}
              onChange={handleInputChange}
            />
            <Box>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <Button
                variant="contained"
                onClick={handleFileUpload}
                disabled={!file}
              >
                Upload Image
              </Button>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(false);
              setEditingService(null);
              setFormData({ title: "", description: "", picture: "" });
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BackOfficeServices;
