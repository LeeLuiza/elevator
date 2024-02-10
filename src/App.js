import React, { useState, useEffect } from 'react';
import './App.css';

function ElevatorShaft() {
  const [currentFloor, setCurrentFloor] = useState(0); //текущий этаж
  const [destinationFloors, setDestinationFloors] = useState([]); //список этажей
  const [isMoving, setIsMoving] = useState(false); //движется ли лифт в данный момент
  let index = 0;

  const handleCallElevator = (floor) => { //добавляет список целей
    if (!destinationFloors.includes(floor)) {
      destinationFloors.push(floor);
      Sort();
    }

    let index = destinationFloors.indexOf(0);
    if (index === -1) {
      setDestinationFloors([...destinationFloors, 0]);
    }
  }

  const Sort = () => {
    destinationFloors.sort(function(a, b) {
      return a - b;
    });
  }

  useEffect(() => {
    if (destinationFloors.length > 0 && !isMoving) {
      Sort();
      setIsMoving(true);
      moveElevator();
    }
  }, [destinationFloors, isMoving]);

  const moveElevator = () => { //проверяет в каком направлении ехать
    index = destinationFloors.length - 1;
    let max = destinationFloors[destinationFloors.length - 1]
    if (currentFloor !== 0) {
      for (let i = destinationFloors.length - 1; i >= 0; i--) {
        console.log(destinationFloors[i] + "<" + currentFloor);
        if (destinationFloors[i] < currentFloor) {
          max = destinationFloors[i];
          index = destinationFloors.indexOf(max);
          break;
        }
      }
    }

    if (currentFloor < max) {
      setTimeout(() => {
        moveUp(max);
      }, 1000);
    } else if (currentFloor > max) {
      setTimeout(() => {
        moveDown(max);
      }, 1000);
    } else {
      setDestinationFloors(prevFloors => prevFloors.filter(floor => floor !== max));
      pickUpPassengers();
    }
  }

  const moveUp = (destination) => { //вверх
    let x = currentFloor;
    const interval = setInterval(() => {
      setCurrentFloor(prevFloor => prevFloor + 1);
      x = x + 1;
      if (x === destination) {
        clearInterval(interval);
        setTimeout(() => {
          DeleteElement(destination);
          let index = destinationFloors.indexOf(0);
          if (index === -1) {
            setDestinationFloors([...destinationFloors, 0]);
          }
          pickUpPassengers();
        }, 500);
      }
    }, 500);
  }

  const moveDown = (destination) => { //вниз
    let x = currentFloor;
    const interval = setInterval(() => {
      setCurrentFloor(prevFloor => prevFloor - 1);
      x = x - 1;
      if (x === destination) {
        clearInterval(interval); // остановка интервала, так что лифт остановится на этаже
        setTimeout(() => {
          DeleteElement(destination);
          pickUpPassengers();
        }, 500); 
      }
    }, 500);
  }

  const DeleteElement = (destination) => {
    index = destinationFloors.indexOf(destination);
    destinationFloors.splice(index, 1);
  }

  const pickUpPassengers = () => {
    setIsMoving(false);
  }

  return (
    <div className="shaft">
      {[...Array(10).keys()].map((_, index) => (
        <button key={index+1} className="floor-button" onClick={() => handleCallElevator(9 - index)}>{10 - index}</button>
      ))}
      <div className="elevator" style={{bottom: `${(currentFloor) * 50}px`}}></div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <ElevatorShaft />
    </div>
  );
}

export default App;