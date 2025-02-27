import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
      .then((response) => response.json())
      .then((data) => {
        setPokemonList(data.results);
        setLoading(false);
      })
      .catch((error) => console.error("Error al obtener los Pokémon:", error));
  }, []);

  const handleSelectPokemon = (pokemonUrl) => {
    fetch(pokemonUrl)
      .then((response) => response.json())
      .then((data) => {
        setSelectedPokemon({
          name: data.name,
          image: data.sprites.front_default,
          height: data.height,
          weight: data.weight,
        });
      })
      .catch((error) => console.error("Error al obtener los detalles:", error));
  };

  const closePopup = () => {
    setSelectedPokemon(null);
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#ffcc00" style={styles.loader} />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Pokémon</Text>
      <FlatList
        data={pokemonList}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <BouncyCheckbox
              size={25}
              fillColor="#ffcc00"
              unfillColor="#FFFFFF"
              text={item.name.toUpperCase()}
              textStyle={{ textDecorationLine: "none" }}
              onPress={() => handleSelectPokemon(item.url)}
            />
          </View>
        )}
      />

      {selectedPokemon && (
        <Modal animationType="slide" transparent={true} visible={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {selectedPokemon.name.toUpperCase()}
              </Text>
              <Image
                source={{ uri: selectedPokemon.image }}
                style={styles.pokemonImage}
              />
              <Text>Altura: {selectedPokemon.height} dm</Text>
              <Text>Peso: {selectedPokemon.weight} hg</Text>
              <TouchableOpacity onPress={closePopup} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  item: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  loader: { flex: 1, justifyContent: "center" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  pokemonImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#ffcc00",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    fontWeight: "bold",
  },
});

export default App;
