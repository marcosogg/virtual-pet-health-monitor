import React, { useState } from "react";
import { addPet } from "../services/api";
import { Button, Input, Select } from "./UIComponents";

function AddPetForm({ onPetAdded }) {
  const [petData, setPetData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    weight: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPet(petData);
      setPetData({
        name: "",
        species: "",
        breed: "",
        age: "",
        weight: "",
      });
      onPetAdded();
    } catch (error) {
      console.error("Error adding pet:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Pet Name"
        id="name"
        name="name"
        value={petData.name}
        onChange={handleChange}
        required
      />
      <Select
        label="Species"
        id="species"
        name="species"
        value={petData.species}
        onChange={handleChange}
        required
        options={[
          { value: "", label: "Select a species" },
          { value: "Dog", label: "Dog" },
          { value: "Cat", label: "Cat" },
          { value: "Other", label: "Other" },
        ]}
      />
      <Input
        label="Breed"
        id="breed"
        name="breed"
        value={petData.breed}
        onChange={handleChange}
      />
      <Input
        label="Age (years)"
        id="age"
        name="age"
        type="number"
        value={petData.age}
        onChange={handleChange}
        min="0"
        step="0.1"
      />
      <Input
        label="Weight (kg)"
        id="weight"
        name="weight"
        type="number"
        value={petData.weight}
        onChange={handleChange}
        min="0"
        step="0.1"
      />
      <Button type="submit">Add Pet</Button>
    </form>
  );
}

export default AddPetForm;
