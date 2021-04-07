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
    // const findExam = []
    // const exams = await SchoolModel.find()
    const exams = await SchoolModel.find({ examDate: { $regex: params.year } })
    // console.log(exams2)
    // exams.forEach(exam => {
    //   const parseDate = exam.examDate.split('.')
    //   if (params.year === parseDate[parseDate.length-1]) {
    //     findExam.push(exam)
    //   }
    // })
    return exams
  }

  async getAllYears() {
    const years = []
    let i = 0
    const exams = await SchoolModel.find({}, { examDate: 1, _id: 0 })
    exams.forEach(item => {
      const parseDate = item.examDate.split('.')
      if (years[i] !== parseDate[parseDate.length-1]) {
        years.push(parseDate[parseDate.length-1])
        if (years.length-1 !== i) {
          i = years.length-1
        }
      }
    })
    return years
  }

  async writeOnMongoDB (path) {
    const newExam = this.parseFile(path)
    const findExam = await SchoolModel.find({examCode: newExam.examCode, examName: newExam.examName, examDate: newExam.examDate})
    if (findExam.length === 0) {
      const dbExam = await SchoolModel.create(newExam)
      return dbExam
    } else {
      await SchoolModel.updateMany(findExam[0], newExam, {new: true})
      return findExam[0]
    }
  }

  parseFile (filePath) {
    const workbook = xlsx.readFile(filePath)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const parseString = worksheet['A1'].v.split(' ')
    const recordsInSheets = {
      examCode: parseString[0],
      examName: this.getNameFromArray(parseString),
      examDate: parseString[parseString.length-1].split('.').reverse().join('.'),
      participants: this.parseParticipants(worksheet)
    }
    return recordsInSheets
  }
  
  parseParticipants(worksheet){
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
          MSY: worksheet[this.encodeCell(row, 1)].v,
          schoolCode: worksheet[this.encodeCell(row, 2)].v,
          class: worksheet[this.encodeCell(row, 3)].v,
          PPACode: worksheet[this.encodeCell(row, 4)].v,
          classroom: worksheet[this.encodeCell(row, 5)].v,
          subname: worksheet[this.encodeCell(row, 6)].v,
          name: worksheet[this.encodeCell(row, 7)].v,
          lastname: worksheet[this.encodeCell(row, 8)].v,
          shortTask: worksheet[this.encodeCell(row, 11)].v,
          detailedTask: worksheet[this.encodeCell(row, 12)].v,
          baseScore: worksheet[this.encodeCell(row, 13)].v,
          score: worksheet[this.encodeCell(row, 14)].v,
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
}

export default new FileService()