import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

const App = () => {
  const [pokemonList, setPokemonList] = useState([]); 
  const [selectedPokemon, setSelectedPokemon] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151") 
      .then((response) => response.json())
      .then((data) => {
        setPokemonList(data.results);
        setLoading(false);
      })
      .catch((error) => console.error("Error al obtener los Pokémon:", error));
  }, []);

  // Función para manejar la selección de Pokémon
  const handleSelectPokemon = (pokemonName, isChecked) => {
    setSelectedPokemon((prevSelected) =>
      isChecked ? [...prevSelected, pokemonName] : prevSelected.filter((name) => name !== pokemonName)
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#ffcc00" style={styles.loader} />;
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
              onPress={(isChecked) => handleSelectPokemon(item.name, isChecked)}
            />
          </View>
        )}
      />
      <Text style={styles.selectedTitle}>Seleccionados:</Text>
      {selectedPokemon.length > 0 ? (
        selectedPokemon.map((pokemon, index) => <Text key={index} style={styles.selected}>{pokemon}</Text>)
      ) : (
        <Text style={styles.selected}>Ninguno</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  item: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  selectedTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  selected: { fontSize: 16, color: "#333", marginVertical: 2 },
  loader: { flex: 1, justifyContent: "center" }
});

export default App;
