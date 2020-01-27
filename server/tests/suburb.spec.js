const app = require('./../app');
const request = require('supertest');
const Suburb = require('./../models/Suburb');

describe('User Tests', () => {
  afterAll(() => {
    jest.clearAllMocks();
    app.close();
  });

  it('should create the suburb', (done) => {
    const mockSuburb = {
      'name': 'mockSuburb'
    };

    jest.spyOn(Suburb.prototype, 'save').mockImplementation(() => {
      return new Promise((res, rej) => res(mockSuburb));
    });
    jest.spyOn(Suburb, 'find').mockImplementation((query) => {
      return {
        'exec': function (callback) {
          callback(null, null);
        }
      }
    });
    request(app)
      .post('/api/suburbs')
      .send({
        'postCode': 'some-post-code',
        'name': 'Suburb name'
      })
      .expect(201)
      .end(function (err, res) {
        expect(err).toBeNull();
        expect(res.body).toEqual(mockSuburb);
        done();
      });
  });

  it('should NOT duplicate a suburb', (done) => {
    const mockSuburb = {
      'name': 'mockSuburb'
    };
    jest.spyOn(Suburb, 'find').mockImplementation((query) => {
      return {
        'exec': function (callback) {
          callback(null, mockSuburb);
        }
      }
    });
    request(app)
      .post('/api/suburbs')
      .send({
        'postCode': 'some-post-code',
        'name': 'Suburb name'
      })
      .expect(400)
      .end(function (err, res) {
        expect(err).toBeNull();
        expect(res.body).toEqual({
          message: 'The requested post code already exists.'
        });
        expect(Suburb.find).toHaveBeenCalledWith({
          postCode: 'some-post-code'
        })
        done();
      });
  });

  it('should delete the suburb', (done) => {
    const mockSuburb = {
      'name': 'mockSuburb'
    };
    const dummyId = 'some-suburb-id';
    jest.spyOn(Suburb, 'deleteOne').mockImplementation((query) => {
      return {
        'exec': () => new Promise((res, rej) => res(mockSuburb))
      }
    });

    request(app)
      .delete('/api/suburbs/' + dummyId)
      .expect(200)
      .end(function (err, res) {
        expect(err).toBeNull();
        expect(res.body).toEqual(mockSuburb);
        expect(Suburb.deleteOne).toBeCalledWith({
          _id: dummyId
        });
        done();
      });
  });

  it('should respond with a 500 if deleting the suburb does not succeed', (done) => {
    const mockSuburb = {
      'name': 'mockSuburb'
    };
    const dummyId = 'some-suburb-id';
    const mockError = 'Deletion failed';
    jest.spyOn(Suburb, 'deleteOne').mockImplementation((query) => {
      return {
        'exec': () => new Promise((res, rej) => rej(mockError))
      }
    });

    request(app)
      .delete('/api/suburbs/' + dummyId)
      .expect(500)
      .end(function (err, res) {
        expect(err).toBeNull();
        expect(res.body).toEqual({
          'error': mockError
        });
        expect(Suburb.deleteOne).toBeCalledWith({
          _id: dummyId
        });
        done();
      });
  });
});
