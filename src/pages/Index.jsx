import React, { useState, useEffect } from "react";
import { Box, Heading, Button, Flex, Text, Input, Textarea, FormControl, FormLabel } from "@chakra-ui/react";
import { FaPlus, FaEdit } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

const HomePage = ({ events, onAddEvent }) => {
  const navigate = useNavigate();

  return (
    <Box>
      <Heading as="h1" mb={4}>
        Events
      </Heading>
      {events.map((event) => (
        <Box key={event.id} p={4} borderWidth={1} mb={4}>
          <Heading as="h2" size="md">
            {event.attributes.name}
          </Heading>
          <Text>{event.attributes.description}</Text>
          <Button leftIcon={<FaEdit />} size="sm" onClick={() => navigate(`/edit/${event.id}`)}>
            Edit
          </Button>
        </Box>
      ))}
    </Box>
  );
};

const CreateEventPage = ({ onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const handleSubmit = () => {
    onSave();
  };

  return (
    <Box>
      <Heading as="h1" mb={4}>
        Create Event
      </Heading>
      <FormControl id="title" mb={4}>
        <FormLabel>Title</FormLabel>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </FormControl>
      <FormControl id="description" mb={4}>
        <FormLabel>Description</FormLabel>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </FormControl>
      <Button onClick={handleSubmit}>Save</Button>
    </Box>
  );
};

const EditEventPage = ({ event, onSave }) => {
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);

  const handleSubmit = () => {
    onSave({ title, description });
  };

  return (
    <Box>
      <Heading as="h1" mb={4}>
        Edit Event
      </Heading>
      <FormControl id="title" mb={4}>
        <FormLabel>Title</FormLabel>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </FormControl>
      <FormControl id="description" mb={4}>
        <FormLabel>Description</FormLabel>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </FormControl>
      <Button onClick={handleSubmit}>Save</Button>
    </Box>
  );
};

const Index = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:1337/api/events");
        const data = await response.json();
        setEvents(data.data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedEventIndex, setSelectedEventIndex] = useState(null);

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:1337/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            name: title,
            description: description,
          },
        }),
      });

      if (response.ok) {
        const newEvent = await response.json();
        setEvents((prevEvents) => [...prevEvents, newEvent.data]);
        setCurrentPage("home");
        setTitle("");
        setDescription("");
      } else {
        console.error("Error creating event:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleEditEvent = (index) => {
    setSelectedEventIndex(index);
    setCurrentPage("edit");
  };

  const handleUpdateEvent = (updatedEvent) => {
    const updatedEvents = [...events];
    updatedEvents[selectedEventIndex] = updatedEvent;
    setEvents(updatedEvents);
    setCurrentPage("home");
  };

  let page;
  if (currentPage === "home") {
    page = <HomePage events={events} onAddEvent={() => setCurrentPage("create")} onEditEvent={handleEditEvent} />;
  } else if (currentPage === "create") {
    page = <CreateEventPage title={title} description={description} onTitleChange={(e) => setTitle(e.target.value)} onDescriptionChange={(e) => setDescription(e.target.value)} onSave={handleSubmit} />;
  } else if (currentPage === "edit") {
    page = <EditEventPage event={events[selectedEventIndex]} onSave={handleUpdateEvent} />;
  }

  return (
    <Box p={4}>
      <Flex mb={4}>
        <Button mr={2} onClick={() => setCurrentPage("home")}>
          Home
        </Button>
        <Button leftIcon={<FaPlus />} onClick={() => setCurrentPage("create")}>
          Create Event
        </Button>
      </Flex>
      {page}
    </Box>
  );
};

export default Index;
