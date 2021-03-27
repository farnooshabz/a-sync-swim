const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const server = require('./mockServer');

const httpHandler = require('../js/httpHandler');

/* START SOLUTION */
const queue = require('../js/messageQueue');
httpHandler.initialize(queue);
/* END SOLUTION */

describe('server responses', () => {

  it('should respond to a OPTIONS request', (done) => {
    let {req, res} = server.mock('/', 'OPTIONS');

    httpHandler.router(req, res);
    expect(res._responseCode).to.equal(200);
    expect(res._ended).to.equal(true);
    expect(res._data.toString()).to.be.empty;

    done();
  });

  it('should respond to a GET request for a swim command', (done) => {
    /* START SOLUTION */
    let {req, res} = server.mock('/', 'GET');

    // pre-load the queue with a command
    const commands = ['up', 'down', 'left', 'right'];
    let index = Math.floor(Math.random() * commands.length);
    queue.enqueue(commands[index]);

    httpHandler.router(req, res);
    expect(res._responseCode).to.equal(200);
    expect(res._ended).to.equal(true);
    expect(commands).to.contain(res._data.toString());
    /* ELSE
    // write your test here
    END SOLUTION */
    done();
  });

  /* START SOLUTION */
  it /* ELSE
  xit END SOLUTION */('should respond with 404 to a GET request for a missing background image', (done) => {
    httpHandler.backgroundImageFile = path.join('.', 'spec', 'missing.jpg');
    /* START SOLUTION */
    let {req, res} = server.mock('/background.jpg', 'GET');
    /* ELSE
    let {req, res} = server.mock('FILL_ME_IN', 'GET');
    END SOLUTION */

    httpHandler.router(req, res, () => {
      expect(res._responseCode).to.equal(404);
      expect(res._ended).to.equal(true);
      done();
    });
  });

  /* START SOLUTION */
  it /* ELSE
  xit END SOLUTION */('should respond with 200 to a GET request for a present background image', (done) => {
    /* START SOLUTION */
    httpHandler.backgroundImageFile = path.join('.', 'spec', 'water-sm.jpg');
    let {req, res} = server.mock('/background.jpg', 'GET');

    httpHandler.router(req, res, () => {
      expect(res._responseCode).to.equal(200);
      expect(res._ended).to.equal(true);
      done();
    });
    /* ELSE
    // write your test here
    done();
    END SOLUTION */
  });

  /* START SOLUTION */
  var postTestFile = path.join('.', 'spec', 'water-lg.multipart');
  /* ELSE
  var postTestFile = path.join('.', 'spec', 'water-lg.jpg');
  END SOLUTION */

  /* START SOLUTION */
  it /* ELSE
  xit END SOLUTION */('should respond to a POST request to save a background image', (done) => {
    fs.readFile(postTestFile, (err, fileData) => {
      httpHandler.backgroundImageFile = path.join('.', 'spec', 'temp.jpg');
      /* START SOLUTION */
      let {req, res} = server.mock('/background.jpg', 'POST', fileData);
      /* ELSE
      let {req, res} = server.mock('FILL_ME_IN', 'POST', fileData);
      END SOLUTION */

      httpHandler.router(req, res, () => {
        expect(res._responseCode).to.equal(201);
        expect(res._ended).to.equal(true);
        done();
      });
    });
  });

  /* START SOLUTION */
  it /* ELSE
  xit END SOLUTION */('should send back the previously saved image', (done) => {
    fs.readFile(postTestFile, (err, fileData) => {
      httpHandler.backgroundImageFile = path.join('.', 'spec', 'temp.jpg');
      /* START SOLUTION */
      let post = server.mock('/background.jpg', 'POST', fileData);
      /* ELSE
      let post = server.mock('FILL_ME_IN', 'POST', fileData);
      END SOLUTION */

      httpHandler.router(post.req, post.res, () => {
        /* START SOLUTION */
        let get = server.mock('/background.jpg', 'GET');
        /* ELSE
        let get = server.mock('FILL_ME_IN', 'GET');
        END SOLUTION */
        httpHandler.router(get.req, get.res, () => {
          /* START SOLUTION */
          const multipart = require('../js/multipartUtils');
          let file = multipart.getFile(fileData);
          expect(Buffer.compare(file.data, get.res._data)).to.equal(0);
          /* ELSE
          expect(Buffer.compare(fileData, get.res._data)).to.equal(0);
          END SOLUTION */
          done();
        });
      });
    });
  });
});