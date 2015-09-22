module.exports = function(Room) {

  // Ensure that each room is uniquely named
  Room.validatesUniquenessOf ('name', {
    scopedTo: []
  });

};
