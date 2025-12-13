const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const SubjectService = require('../../../src/services/SubjectService');
const { faker } = require('@faker-js/faker');
const NullSubject = require('../../../src/classes/NullSubject');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Subject service test', () => {
  let service;
  let Csubject;

  let name, credits, code
  beforeEach(() => {
    service = new SubjectService();
  });

  test('should create new subject', async () => {
    const name = faker.word.noun();
    const code = faker.word.adjective();
    const credits = faker.number.int({ min: 1, max: 2 });

    const subject = await service.createNewSubject({
      code,
      name,
      credits,
    });
    expect(subject.id).toBeDefined();
    expect(subject.name).toBe(name);
    expect(subject.code).toBe(code);
    expect(subject.credits).toBe(credits);
    Csubject = subject
  });

  test('should get subject byId', async () => { 
    const subject = await service.getSubjectById(Csubject.id);
    expect(subject).toBeDefined()
    expect(subject).not.toBe(NullSubject)
    expect(subject.name).toBe(Csubject.name)
    expect(subject.code).toBe(Csubject.code)
    expect(subject.credits).toBe(Csubject.credits)
   })
  
  test('should update subject findById', async () => { 
    name = faker.word.noun();
    code = faker.word.adjective();
    credits = faker.number.int({ min: 1, max: 2 });

    const subject = await service.updateSubjectById({id: Csubject.id, name:name, code:code, credits:credits})
    expect(subject).toBeDefined()
    expect(subject).not.toBe(NullSubject)
    expect(subject.name).toBe(name)
    expect(subject.code).toBe(code)
    expect(subject.credits).toBe(credits)
  })

  test('should update deleted state of the subject', async () => {
    const subject = await service.updateSubjectById({id:Csubject.id, deleted: true});
    expect(subject).toBeDefined()
    expect(subject).not.toBe(NullSubject)
    expect(subject.deleted).toBe(true)
    
   })

  test('should find subject by name', async () => { 
    const subjects = await service.findSubject({name:name});
    subjects.forEach(subject => {
      expect(subject).toBeDefined()
      expect(subject).not.toBe(NullSubject)
      expect(subject.name).toBe(name)
    }); 
  })

    test('should find subject by code', async () => { 
    const subjects = await service.findSubject({code:code});
    subjects.forEach(subject => {
      expect(subject).toBeDefined()
      expect(subject).not.toBe(NullSubject)
      expect(subject.code).toBe(code)
    }); 
  })

      test('should find subject by credits', async () => { 
    const subjects = await service.findSubject({credits:credits});
    subjects.forEach(subject => {
      expect(subject).toBeDefined()
      expect(subject).not.toBe(NullSubject)
      expect(subject.credits).toBe(credits)
    }); 
  })

        test('should find subject by createdAt', async () => { 
    const subjects = await service.findSubject({createdAt_timestamp:Csubject.createdAt_timestamp});
    subjects.forEach(subject => {
  
      expect(subject).toBeDefined()
      expect(subject).not.toBe(NullSubject)
      expect(subject.createdAt_timestamp).toBe(Csubject.createdAt_timestamp)
    }); 
  })

  test('should find subject by updatedAt', async () => { 
    const subjects = await service.findSubject({updatedAt_timestamp:Csubject.updatedAt_timestamp});
    subjects.forEach(subject => {
      expect(subject).toBeDefined()
      expect(subject).not.toBe(NullSubject)
      expect(subject.updatedAt_timestamp).toBe(Csubject.updatedAt_timestamp)
    }); 
  })

  test('should not findById deleted subject', async () => { 
    const subject = await service.getSubjectById(Csubject.id, [], {deleted:false})
    expect(subject).toBeDefined()
    expect(subject).toBe(NullSubject)
   })

   test('should delete subject byId', async () => {
    const subject = await service.deleteSubjectById(Csubject.id);
     expect(subject).toBeDefined()
     expect(subject).not.toBe(NullSubject)

   })
   test('should check nullSubject using subject service', async () => { 
    const subject = await service.deleteSubjectById("6938574898c93ac15b8ad669");
    const isNullSubject = service.isNullSubject(subject)
    expect(isNullSubject).toBe(true)
    })
});
