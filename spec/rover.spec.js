const Rover = require("../rover.js");
const Message = require("../message.js");
const Command = require("../command.js");

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.

describe("Rover class", function () {
  it("constructor sets position and default values for mode and generatorWatts", function () {
    const rover = new Rover(98382);
    expect(rover.position).toEqual(98382);
    expect(rover.mode).toEqual("NORMAL");
    expect(rover.generatorWatts).toEqual(110);
  });

  it("response returned by receiveMessage contains the name of the message", function () {
    const commands = [
      new Command("MODE_CHANGE", "LOW_POWER"),
      new Command("STATUS_CHECK"),
    ];
    const message = new Message("Test message", commands);
    const rover = new Rover(98382);
    const response = rover.receiveMessage(message);
    expect(response.message).toEqual("Test message");
  });

  it("response returned by receiveMessage includes two results if two commands are sent in the message", function () {
    const commands = [
      new Command("MODE_CHANGE", "LOW_POWER"),
      new Command("STATUS_CHECK"),
    ];
    const message = new Message("Test message", commands);
    const rover = new Rover(98382);
    const response = rover.receiveMessage(message);
    expect(response.results.length).toEqual(2);
  });

  it("responds correctly to the status check command", function () {
    const commands = [new Command("STATUS_CHECK")];
    const message = new Message("Status check command", commands);
    const rover = new Rover(98382);
    const response = rover.receiveMessage(message);
    expect(response.results[0].completed).toBe(true);
    expect(response.results[0].roverStatus).toEqual({
      mode: "NORMAL",
      generatorWatts: 110,
      position: 98382,
    });
  });

  it("responds correctly to the mode change command", function () {
    const commands = [new Command("MODE_CHANGE", "LOW_POWER")];
    const message = new Message("Mode change command", commands);
    const rover = new Rover(98382);
    const response = rover.receiveMessage(message);
    expect(response.results[0].completed).toBe(true);
    expect(rover.mode).toEqual("LOW_POWER");
  });

  it("responds with a false completed value when attempting to move in LOW_POWER mode", function () {
    const commands = [
      new Command("MODE_CHANGE", "LOW_POWER"),
      new Command("MOVE", 12000),
    ];
    const message = new Message("Attempt to move in low power mode", commands);
    const rover = new Rover(98382);
    const response = rover.receiveMessage(message);
    expect(response.results[1].completed).toBe(false);
    expect(rover.position).toEqual(98382);
  });

  it("responds with the position for the move command", function () {
    const commands = [new Command("MOVE", 12000)];
    const message = new Message("Move to position 12000", commands);
    const rover = new Rover(98382);
    const response = rover.receiveMessage(message);
    expect(response.results[0].completed).toBe(true);
    expect(rover.position).toEqual(12000);
  });
});
