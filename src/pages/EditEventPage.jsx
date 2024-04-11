import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Heading, Button, FormControl, FormLabel, Input, Textarea } from "@chakra-ui/react";

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:1337/api/events/${id}`);
        const data = await response.json();
        setEvent(data.data);
        setName(data.data.attributes.name);
        setDescription(data.data.attributes.description);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEvent();
  }, [id]);

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:1337/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            name,
            description,
          },
        }),
      });

      if (response.ok) {
        navigate("/");
      } else {
        console.error("Error updating event:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <Box>
      <Heading as="h1" mb={4}>
        Edit Event
      </Heading>
      <FormControl id="title" mb={4}>
        <FormLabel>Title</FormLabel>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </FormControl>
      <FormControl id="description" mb={4}>
        <FormLabel>Description</FormLabel>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </FormControl>
      <Button onClick={handleSubmit}>Save</Button>
    </Box>
  );
};

export default EditEventPage;
