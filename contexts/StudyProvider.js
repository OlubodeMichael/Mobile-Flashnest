import React, { createContext, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const StudyContext = createContext();

export const StudyProvider = ({ children }) => {
  const [decks, setDecks] = useState([]);
  const [deck, setDeck] = useState(null); // optional: current selected deck
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const api_url = "http://localhost:8000/api";

  const fetchDecks = async () => {
    try {
      setIsLoading(true);

      const token = await AsyncStorage.getItem("token");

      const response = await axios.get(`${api_url}/decks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDecks(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StudyContext.Provider
      value={{ decks, deck, flashcards, isLoading, error, fetchDecks }}>
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => useContext(StudyContext);
