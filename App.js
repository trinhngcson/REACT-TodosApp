
import React from 'react';
import firestore from '@react-native-firebase/firestore';
import { ScrollView, Text, View } from 'react-native';
import {Appbar,TextInput, Button} from 'react-native-paper';
import { FlatList } from 'react-native-gesture-handler';
// import { List } from "react-native-paper";
import Todo from "./todo/todo"
function App(){
  const [todo, setTodo] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [todos, setTodos] = React.useState([]);
  const ref = firestore().collection('todos');
  async function addTodo(){
    await ref.add({
      title: todo,
      complete: false,
    });
    setTodo('');
  }
  // function Todo ({id, title, complete}) {
  //   async function toggleComplete() {
  //       await firestore ()
  //           .collection('todos')
  //           .doc(id)
  //           .update({
  //               complete: !complete,
  //           });
  //   }
  //   return (
  //       <List.Item 
  //           title = {title}
  //           onPress = {() => toggleComplete()}
  //           left = {props => (
  //               <List.Icon {...props} icon = {complete ? 'check' : 'cancel'}/>
  //           )}
  //       />
  //   );
//}
  React.useEffect (()=> {
    return ref.onSnapshot(querySnapshot => {
        const list =[];
        querySnapshot.forEach(doc => {
          const {title, complete} = doc.data();
          list.push({
            id:doc.id,
            title,
            complete,
          });
        });
        setTodos(list);
        if (loading) {
          setLoading(false);
        }
    });
  });
  if (loading) {
    return null;
  }
  return (
    <View style={{flex: 1}}>
      <Appbar>
        <Appbar.Content title = {'TODOs List'}></Appbar.Content>
      </Appbar>
      <FlatList 
        style ={{flex: 1}}
        data = {todos}
        keyExtractor = {(item) => item.id}
        renderItem = {({item}) => <Todo {...item}/>}
      />
      <TextInput label = {'New Todo'} value={todo} onChangeText = {(text) => setTodo(text)}/>
      <Button onPress = {addTodo}>Add TODO</Button>
      
    </View>
    );
}

export default App;