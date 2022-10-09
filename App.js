/* eslint-disable prettier/prettier */

import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Pressable,
  Alert,
} from 'react-native';
import bg from './assets/bg.jpeg';
import Cell from './src/components/Cell';

const emptyMap = [
  ['', '', ''], // 1st row
  ['', '', ''], // 2nd row
  ['', '', ''], // 3rd row
];

const copyArray = original => {
  const copy = original.map(arr => {
    return arr.slice();
  });
  return copy;
};

export default function App() {
  const [map, setMap] = useState(emptyMap);
  const [currentTurn, setCurrentTurn] = useState('x');
  const [gameMode, setGameMode] = useState('BOT_MEDIUM'); // LOCAL, BOT_EASY, BOT_MEDIUM;
  const onPress = (rowIndex, cellIndex) => {
    if (map[rowIndex][cellIndex] !== '') {
      Alert.alert('Position already occupied');
      return;
    }
    setMap(prev => {
      const updatedMap = [...prev];
      updatedMap[rowIndex][cellIndex] = currentTurn;
      return updatedMap;
    });
    setCurrentTurn(prev => (prev == 'o' ? 'x' : 'o'));
  };
  useEffect(() => {
    resetGame();
  }, [gameMode]);
  useEffect(() => {
    if (currentTurn === 'o' && gameMode !== 'LOCAL') {
      botTurn();
    }
  }, [currentTurn, gameMode]);
  useEffect(() => {
    const winner = getWinner(map);
    console.log(winner);
    if (winner) {
      gameWon(winner);
    } else {
      checkGameTie();
    }
  }, [map]);

  const getWinner = winnerMap => {
    //rows
    for (let row = 0; row < 3; row++) {
      const rowXWinner = winnerMap[row].every(cell => cell === 'x');
      const rowOWinner = winnerMap[row].every(cell => cell === 'o');
      // for (let col = 0; col < 3; col++) {
      //   if(map[row][col]!='x')rowXWinner=false;
      //   if(map[row][col]!='o')rowOWinner=false;
      // }
      if (rowOWinner) return 'o';
      if (rowXWinner) return 'x';
    }
    //cols
    for (let col = 0; col < 3; col++) {
      let colXWinner = true;
      let colOWinner = true;
      for (let row = 0; row < 3; row++) {
        if (winnerMap[row][col] != 'x') colXWinner = false;
        if (winnerMap[row][col] != 'o') colOWinner = false;
      }
      if (colOWinner) return 'o';
      if (colXWinner) return 'x';
    }
    //diagonals
    let isDiagonal1OWinning = true;
    let isDiagonal1XWinning = true;
    let isDiagonal2OWinning = true;
    let isDiagonal2XWinning = true;
    for (let i = 0; i < 3; i++) {
      if (winnerMap[i][i] != 'x') isDiagonal1XWinning = false;
      if (winnerMap[i][i] != 'o') isDiagonal1OWinning = false;
      if (winnerMap[i][2 - i] != 'x') isDiagonal2XWinning = false;
      if (winnerMap[i][2 - i] != 'o') isDiagonal2OWinning = false;
    }
    if (isDiagonal1OWinning || isDiagonal2OWinning) {
      return 'o';
    }
    if (isDiagonal1XWinning || isDiagonal2XWinning) {
      return 'x';
    }
  };
  const resetGame = () => {
    setMap([
      ['', '', ''], // 1st row
      ['', '', ''], // 2nd row
      ['', '', ''], // 3rd row
    ]);
    setCurrentTurn('x');
  };
  const gameWon = winner => {
    Alert.alert(`Huraaay`, `Player ${winner} won`, [
      {
        text: 'Restart',
        onPress: resetGame,
      },
    ]);
  };
  const checkGameTie = () => {
    if (!map.some(row => row.some(cell => cell === ''))) {
      Alert.alert(`It's a tie`, `tie`, [
        {
          text: 'Restart',
          onPress: resetGame,
        },
      ]);
    }
  };
  const botTurn=()=>{
    let possiblePositions=[]
    map.forEach((row,rowIndex)=>{
      row.forEach((cell,cellIndex)=>{
        if(!cell)possiblePositions.push({row:rowIndex,cell:cellIndex})
      })
    })
    let chosenOption;
    if(gameMode=='BOT_MEDIUM'){
      //attack
      possiblePositions.forEach(position=>{
        const {row,cell}=position;
        const mapCopy = copyArray(map);
        mapCopy[row][cell]='o'
        if(getWinner(mapCopy)=='o')chosenOption=position;
      })
      if(!chosenOption){
        //defend
        possiblePositions.forEach(position=>{
          const {row,cell}=position;
          const mapCopy = copyArray(map);
          mapCopy[row][cell]='x'
          if(getWinner(mapCopy)=='x')chosenOption=position;
        })
      }
    }
     // choose random
    if (!chosenOption) {
      chosenOption =
        possiblePositions[Math.floor(Math.random() * possiblePositions.length)];
    }
    // choose random
    if (chosenOption) {
      onPress(chosenOption.row,chosenOption.cell)
    }

  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#242d34',
        justifyContent: 'space-around',
      }}>
      <Text style={{color: '#fff', fontSize: 22, textAlign: 'center'}}>
        Current Turn : {currentTurn}
      </Text>

      <View style={{padding: 20}}>
        {map.map((row, rowIndex) => (
          <View
            style={[
              {flexDirection: 'row', padding: 0},
              rowIndex != 2
                ? {borderBottomWidth: 8, borderColor: '#215676'}
                : {},
            ]}
            key={`row-${rowIndex}`}>
            {row.map((cell, cellIndex) => (
              <Cell
                onPress={() => onPress(rowIndex, cellIndex)}
                key={`row-${rowIndex}-cell-${cellIndex}`}
                cell={cell}
                cellIndex={cellIndex}
              />
            ))}
          </View>
        ))}
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Pressable
          onPress={() => setGameMode('BOT_MEDIUM')}
          style={[
            {padding: 12},
            gameMode == 'BOT_MEDIUM'
              ? {backgroundColor: '#4f5586'}
              : {backgroundColor: '#1a1f25'},
          ]}>
          <Text style={{color: '#fff', fontSize: 17}}>Medium Bot</Text>
        </Pressable>
        <Pressable
          onPress={() => setGameMode('BOT_EASY')}
          style={[
            {padding: 12, marginHorizontal: 10},
            gameMode == 'BOT_EASY'
              ? {backgroundColor: '#4f5586'}
              : {backgroundColor: '#1a1f25'},
          ]}>
          <Text style={{color: '#fff', fontSize: 17}}>Easy Bot</Text>
        </Pressable>
        <Pressable
          onPress={() => setGameMode('LOCAL')}
          style={[
            {padding: 12},
            gameMode == 'LOCAL'
              ? {backgroundColor: '#4f5586'}
              : {backgroundColor: '#1a1f25'},
          ]}>
          <Text style={{color: '#fff', fontSize: 17}}>Local</Text>
        </Pressable>
      </View>
    </View>
  );
}
