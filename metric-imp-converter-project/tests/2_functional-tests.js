const chaiHttp = require("chai-http");
const chai = require("chai");
let assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  suite("Routing Tests", function () {
    suite("GET /api/convert => conversion object", function () {
      test("Performs a valid conversion from 10L to gallons", function (done) {
        chai
          .request(server)
          .get("/api/convert")
          .query({ input: "10L" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.initNum, 10);
            assert.equal(res.body.initUnit, "L");
            assert.approximately(res.body.returnNum, 2.64172, 0.1);
            assert.equal(res.body.returnUnit, "gal");
            done();
          });
      });

      test("Handles invalid unit input: 32g", function (done) {
        chai
          .request(server)
          .get("/api/convert")
          .query({ input: "32g" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.initUnit, undefined);
            done();
          });
      });

      test("Handles invalid number input: 3/7.2/4kg", function (done) {
        chai
          .request(server)
          .get("/api/convert")
          .query({ input: "3/7.2/4kg" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.initNum, undefined);
            done();
          });
      });

      test("Handles invalid number and unit input: 3/7.2/4kilomegagram", function (done) {
        chai
          .request(server)
          .get("/api/convert")
          .query({ input: "3/7.2/4kilomegagram" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.initNum, undefined);
            assert.equal(res.body.initUnit, undefined);
            done();
          });
      });

      test("Defaults to 1 when no number is provided for kg conversion", function (done) {
        chai
          .request(server)
          .get("/api/convert")
          .query({ input: "kg" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.initNum, 1);
            assert.equal(res.body.initUnit, "kg");
            assert.approximately(res.body.returnNum, 2.20462, 0.1);
            assert.equal(res.body.returnUnit, "lbs");
            done();
          });
      });
    });
  });
});