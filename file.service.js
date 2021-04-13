import path from 'path'
import xlsx from 'xlsx'
import SchoolModel from './exam.schema.js'

class FileService {
  async saveFile(file) {
    try {
      let createdExam = []
      if (Array.isArray(file)) {
        for (let item in file) {
          const filePath = path.resolve('static', file[item].name)
          await file[item].mv(filePath)
          createdExam.push(await this.writeOnMongoDB(filePath))
        }
      } else {
        const filePath = path.resolve('static', file.name)
        await file.mv(filePath)
        createdExam.push(await this.writeOnMongoDB(filePath))
      }
      return createdExam
    } catch (e) {
      console.log(e)
    }
  }

  async getAll(params) {
    const exams = await SchoolModel.aggregate([
      { $project: {
        examCode: '$examCode',
        examName: '$examName',
        participants: { $filter: {
          input: '$participants',
          as: 'participant',
          cond: { $eq: [{ $year: '$$participant.examDate' }, +params.year] }
        }}
      }},
      { $match: { participants: { $ne: [] } } }
    ])
    return exams
  }

  async getAllYears() {
    const years = []
    const datesFromDB = await SchoolModel.distinct('participants.examDate')
    datesFromDB.forEach(date => {
      const year = date.getFullYear()
      if (!years.includes(year)) {
        years.push(year)
      }
    })
    return years
  }

  async getAllSchools() {
    const schoolsFromDB = await SchoolModel.distinct('participants.schoolCode')
    const schools = ['Все школы', ...schoolsFromDB]
    return schools
  }

  async writeOnMongoDB (path) {
    const newExam = this.parseFile(path)
    const findExamFromDB = await SchoolModel.findOne({examCode: newExam.examCode, examName: newExam.examName})
    if (findExamFromDB) {
      for (let indexExamFromDB in findExamFromDB.participants) {
        for (let index in newExam.participants) {
          if (findExamFromDB.participants[indexExamFromDB].subname === newExam.participants[index].subname
            && findExamFromDB.participants[indexExamFromDB].name === newExam.participants[index].name
            && findExamFromDB.participants[indexExamFromDB].lastname === newExam.participants[index].lastname) {
              findExamFromDB.participants[indexExamFromDB] = newExam.participants[index]
            }
        }
      }
      newExam.participants.forEach(participant => {
        if (!findExamFromDB.participants.includes(participant)) {
          findExamFromDB.participants.push(participant)
        }
      })
      const updatedExams = await SchoolModel.findOneAndUpdate({examCode: newExam.examCode, examName: newExam.examName}, findExamFromDB, {new: true})
      return updatedExams
    }
    const createdExam = await SchoolModel.create(newExam)
    return createdExam
  }

  parseFile (filePath) {
    const workbook = xlsx.readFile(filePath)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const parseString = worksheet['A1'].v.split(' ')
    const recordsInSheets = {
      examCode: parseString[0],
      examName: this.getNameFromArray(parseString),
      examDate: new Date(parseString[parseString.length-1])
    }
    recordsInSheets.participants = this.parseParticipants(worksheet, recordsInSheets.examDate)
    return recordsInSheets
  }
  
  parseParticipants(worksheet, data){
    const ref = xlsx.utils.decode_range(worksheet['!ref'])
    const participants = [] 
    for (let row = 2; row <= ref.e.r; row++){
      if (
        worksheet[this.encodeCell(row, 1)] && 
        worksheet[this.encodeCell(row, 2)] &&
        worksheet[this.encodeCell(row, 3)] &&
        worksheet[this.encodeCell(row, 4)] &&
        worksheet[this.encodeCell(row, 5)] &&
        worksheet[this.encodeCell(row, 6)] &&
        worksheet[this.encodeCell(row, 7)] &&
        worksheet[this.encodeCell(row, 8)] &&
        worksheet[this.encodeCell(row, 11)] &&
        worksheet[this.encodeCell(row, 12)] &&
        worksheet[this.encodeCell(row, 13)] &&
        worksheet[this.encodeCell(row, 14)]
      ) {
        const participant = {
          examDate: data,
          MSY: worksheet[this.encodeCell(row, 1)].v,
          schoolCode: worksheet[this.encodeCell(row, 2)].v,
          class: worksheet[this.encodeCell(row, 3)].v,
          PPACode: worksheet[this.encodeCell(row, 4)].v,
          classroom: worksheet[this.encodeCell(row, 5)].v,
          subname: worksheet[this.encodeCell(row, 6)].v,
          name: worksheet[this.encodeCell(row, 7)].v,
          lastname: worksheet[this.encodeCell(row, 8)].v,
          shortTask: this.parseTasks(worksheet[this.encodeCell(row, 11)].v),
          detailedTask: this.parseTasks(worksheet[this.encodeCell(row, 12)].v, 'detailed'),
          baseScore: worksheet[this.encodeCell(row, 13)].v,
          score: worksheet[this.encodeCell(row, 14)].v
        }
        participants.push(participant)
      } else {
        continue
      }
    }
    return participants
  }

  encodeCell (row, column) {
    return xlsx.utils.encode_cell({ c: column, r: row })
  }

  getNameFromArray (array) {
    let string = ''
    for (let i = 2; i < array.length - 1; i++) {
      if (i === array.length - 2) {
        string += `${array[i]}`  
      } else {
        string += `${array[i]} `
      }
    }
    return string
  }

  parseTasks (string, typeOfTasks = 'short') {
    switch (typeOfTasks) {
      case 'short':
        const resultShortArray = []
        string.split('').forEach(item => {
          switch (item) {
            case '-':
              resultShortArray.push(0)              
              break
            case '+':
              resultShortArray.push(1)
              break
            default:
              resultShortArray.push(+item)
              break
          }
        })
        console.log(resultShortArray)
        return resultShortArray
      case 'detailed':
        const resultDetailedArray = []
        const parseString = string.split('')
        for (let index = 0;  index < parseString.length; index++) {
          if (!isNaN(+parseString[index])) {
            resultDetailedArray.push(+parseString[index])
            index += 3
          }
        }
        console.log(resultDetailedArray)
        return resultDetailedArray
    }
  }
}

export default new FileService()