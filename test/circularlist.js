var assert = require("chai").assert
var CircularList = require('../lib/circularlist')
var circularlist

beforeEach(function () {
    circularlist = new CircularList()
})

describe("Base circular list tests", function () {
    describe("testing initial properties", function () {
        it("Testing head", function () {
            assert.equal(circularlist.head, undefined, "Head should be undefined")
        })
        it("Testing tail", function () {
            assert.equal(circularlist.tail, undefined, "Tail should be undefined")
        })
        it("Testing size", function () {
            assert.equal(circularlist.size, 0, "Size should be 0")
        })
        it("Testing iterator", function () {
            assert.equal(circularlist.iterator, undefined, "Iterator should be undefined")
        })
    })

    describe("Testing basic operations", function () {
        it("Testing push", function () {
            circularlist.push("junk")
            assert.equal(circularlist.head, "junk", "Head should be \"junk\"")
            assert.equal(circularlist.tail, "junk", "Tail should be \"junk\"")
            assert.equal(circularlist.size, 1, "Size should be 1")
            assert.equal(circularlist.iterator, "junk", "Iterator should be \"junk\"")
        })
        it("Testing pop", function () {
            circularlist.push("junk")
            circularlist.pop()
            assert.equal(circularlist.head, undefined, "Head should be undefined")
            assert.equal(circularlist.tail, undefined, "Tail should be undefined")
            assert.equal(circularlist.size, 0, "Size should be 0")
            assert.equal(circularlist.iterator, undefined, "Iterator should be undefined")
        })
    })
})