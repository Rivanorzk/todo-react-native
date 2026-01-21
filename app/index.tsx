import { Text, View, TextInput, Button, TouchableOpacity, StyleSheet } from "react-native";
import Checkbox from 'expo-checkbox';
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";

type Todo = {
  id: number;
  kegiatan: string;
  waktu: string;
  checked: boolean;
};

export default function Index(){
    const [checked, setChecked] = useState(false)
    const [kegiatan, setKegiatan] = useState("")
    const [waktu, setWaktu] = useState("")
    const [todos, setTodos] = useState<Todo[]>([]);
    const [showForm, setShowForm] = useState(false);

    const handleTambah = async () => {
        if (!kegiatan || !waktu) {
        alert("Isi kegiatan dan waktu dulu!");
        return;
        }

        const newTodo: Todo = {
        id: Date.now(),
        kegiatan,
        waktu,
        checked,
        };

        const updated = [...todos, newTodo];
        setTodos(updated);
        await AsyncStorage.setItem("todos", JSON.stringify(updated));

        // reset
        setKegiatan("");
        setWaktu("");
        setChecked(false);
        setShowForm(false);
    };

        const ambil = async () => {
        const data = await AsyncStorage.getItem("todos");
        if (data) {
        setTodos(JSON.parse(data));
        }
    };

        const hapus = async (id: number) => {
        const filtered = todos.filter(item => item.id !== id);
        setTodos(filtered);
        await AsyncStorage.setItem("todos", JSON.stringify(filtered));
    };

    const toggleCheck = async (id: number) => {
    const updated = todos.map(todo =>
        todo.id === id
        ? { ...todo, checked: !todo.checked }
        : todo
    );

    setTodos(updated);
    await AsyncStorage.setItem("todos", JSON.stringify(updated));
    };


    useEffect(() => {
    ambil();
  }, []);

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Todo App</Text>
            </View>

            <TouchableOpacity style={styles.fab} onPress={()=> setShowForm(!showForm)}>
                 <AntDesign name="plus" size={28} color="black" />
            </TouchableOpacity>

            {showForm && (
            <View style={styles.form}>
            <TextInput style={styles.input} placeholder="Masukkan Nama Kegiatan" value={kegiatan} onChangeText={setKegiatan}></TextInput>
            <TextInput style={styles.input} placeholder="Masukkan Waktu" value={waktu} onChangeText={setWaktu}></TextInput>
            <TouchableOpacity style={styles.button} onPress={handleTambah}>
                <Text style={styles.text}>Tambahkan Jadwal</Text>
            </TouchableOpacity>
            </View>
            )}

             {todos.map(item => (
                <View
                key={item.id}
                style={styles.todoItem}
                >
                <View>
                    <Text style={styles.text}>{item.kegiatan}</Text>
                    <Text style={styles.text}>{item.waktu}</Text>
                </View>

                <View style={styles.todoAction}>
                    <Checkbox value={item.checked} onValueChange={() => toggleCheck(item.id)} />
                    <TouchableOpacity onPress={() => hapus(item.id)}>
                    <AntDesign name="delete" size={22} color="#233d4d" />
                    </TouchableOpacity>
                </View>
                </View>
            ))}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: "#233d4d",
  paddingBottom: 100, 
},
header: {
    height: 60,
    backgroundColor: "#fe7f2d",
    justifyContent: "center",
    paddingHorizontal: 20,
    elevation: 4,
  },
  headerTitle: {
    color: "#233d4d",
    fontSize: 20,
    fontWeight: "bold",
  },

todoItem: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 16,
  marginHorizontal: 16,
  marginTop: 20,
  borderRadius: 12,
  backgroundColor: "#fe7f2d",
},

todoAction: {
  flexDirection: "row",
  alignItems: "center",
  gap: 24,
},
  form:{
    marginTop: 20,
    padding: 12
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#233d4d",
  },
   input: {
    borderWidth: 1,
    borderColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    color: "#",
    backgroundColor:"#fe7f2d"
  },
    fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#fe7f2d",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
},
button: {
  backgroundColor: "#fe7f2d",
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: "center",
  marginTop: 10,
  width: "20%",
},

});