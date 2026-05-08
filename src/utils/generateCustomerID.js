function generateStudentID() {
  return Math.random().toString().slice(2, 8);
}

export default generateStudentID;