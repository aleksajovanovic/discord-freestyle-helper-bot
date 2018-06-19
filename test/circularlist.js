var assert = require("chai").assert
var expect = require("chai").expect
var CircularList = require('../lib/circularlist')
var circularlist

beforeEach(function () {
    circularlist = new CircularList()
})

describe("Base circular list tests", function () {
    describe("Testing initial properties", function () {
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

    describe("Testing push and pop", function () {
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
        it("Testing multiple push & pop", function () {
            circularlist.push("junk")
            assert.equal(circularlist.head, "junk", "Head should be \"junk\"")
            assert.equal(circularlist.tail, "junk", "Tail should be \"junk\"")
            assert.equal(circularlist.size, 1, "Size should be 1")
            assert.equal(circularlist.iterator, "junk", "Iterator should be \"junk\"")

            circularlist.push("hippopotamus")
            assert.equal(circularlist.head, "junk", "Head should be \"junk\"")
            assert.equal(circularlist.tail, "hippopotamus", "Tail should be \"hippopotamus\"")
            assert.equal(circularlist.size, 2, "Size should be 2")
            assert.equal(circularlist.iterator, "junk", "Iterator should be \"junk\"")

            circularlist.push("tyrannosaurus")
            assert.equal(circularlist.head, "junk", "Head should be \"junk\"")
            assert.equal(circularlist.tail, "tyrannosaurus", "Tail should be \"tyrannosaurus\"")
            assert.equal(circularlist.size, 3, "Size should be 3")
            assert.equal(circularlist.iterator, "junk", "Iterator should be \"junk\"")

            circularlist.pop()
            assert.equal(circularlist.head, "junk", "Head should be \"junk\"")
            assert.equal(circularlist.tail, "hippopotamus", "Tail should be \"hippopotamus\"")
            assert.equal(circularlist.size, 2, "Size should be 2")
            assert.equal(circularlist.iterator, "junk", "Iterator should be \"junk\"")

            circularlist.pop()
            assert.equal(circularlist.head, "junk", "Head should be \"junk\"")
            assert.equal(circularlist.tail, "junk", "Tail should be \"junk\"")
            assert.equal(circularlist.size, 1, "Size should be 1")
            assert.equal(circularlist.iterator, "junk", "Iterator should be \"junk\"")

            circularlist.pop()
            assert.equal(circularlist.head, undefined, "Head should be undefined")
            assert.equal(circularlist.tail, undefined, "Tail should be undefined")
            assert.equal(circularlist.size, 0, "Size should be 0")
            assert.equal(circularlist.iterator, undefined, "Iterator should be undefined")
        })
        
    })

    describe("Testing rotation", function () {
        it("Testing rotate", function () {
            circularlist.push("junk")
            circularlist.push("hippopotamus")
            circularlist.push("tyrannosaurus")

            circularlist.rotate()
            assert.equal(circularlist.head, "hippopotamus", "Head should be \"hippopotamus\"")
            assert.equal(circularlist.tail, "junk", "Tail should be \"junk\"")
            assert.equal(circularlist.size, 3, "Size should be 3")
            assert.equal(circularlist.iterator, "hippopotamus", "Iterator should be \"hippopotamus\"")
        })
        it("Testing unrotate", function () {
            circularlist.push("junk")
            circularlist.push("hippopotamus")
            circularlist.push("tyrannosaurus")

            circularlist.unrotate()
            assert.equal(circularlist.head, "tyrannosaurus", "Head should be \"tyrannosaurus\"")
            assert.equal(circularlist.tail, "hippopotamus", "Tail should be \"hippopotamus\"")
            assert.equal(circularlist.size, 3, "Size should be 3")
            assert.equal(circularlist.iterator, "tyrannosaurus", "Iterator should be \"tyrannosaurus\"")
        })
    })

    describe("Testing set and get", function () {
        it("Single set", function () {
            circularlist.push("junk")
            circularlist.push("hippopotamus")
            circularlist.push("tyrannosaurus")

            circularlist.set(0, "wharf")
            assert.equal(circularlist.head, "wharf", "Head should be \"wharf\"")
            assert.equal(circularlist.tail, "tyrannosaurus", "Tail should be \"tyrannosaurus\"")
            assert.equal(circularlist.size, 3, "Size should be 3")
            assert.equal(circularlist.iterator, "wharf", "Iterator should be \"wharf\"")
        })
        it("Multiple set", function () {
            circularlist.push("junk")
            circularlist.push("hippopotamus")
            circularlist.push("tyrannosaurus")

            circularlist.set(0, "wharf")
            circularlist.set(2, "perennial")
            assert.equal(circularlist.head, "wharf", "Head should be \"wharf\"")
            assert.equal(circularlist.tail, "perennial", "Tail should be \"perennial\"")
            assert.equal(circularlist.size, 3, "Size should be 3")
            assert.equal(circularlist.iterator, "wharf", "Iterator should be \"wharf\"")
        })
        it("get", function () {
            circularlist.push("junk")
            circularlist.push("hippopotamus")
            circularlist.push("tyrannosaurus")

            assert.equal(circularlist.get(2), "tyrannosaurus", "get should return \"tyrannosaurus\"")
            assert.equal(circularlist.get(0), "junk", "get should return \"junk\"")
            assert.throw(function () { circularlist.get(-1); }, Error, 'Index "-1" out of bounds')
        })
    })

    describe("Testing insert and remove", function () {
        it("insert", function () {
            circularlist.push("junk")
            circularlist.push("hippopotamus")
            circularlist.push("tyrannosaurus")

            circularlist.insert(0, "jiminy")
            assert.equal(circularlist.head, "jiminy", "Head should be \"jiminy\"")
            assert.equal(circularlist.tail, "tyrannosaurus", "Tail should be \"tyrannosaurus\"")
            assert.equal(circularlist.size, 4, "Size should be 4")
            assert.equal(circularlist.iterator, "junk", "Iterator should be \"junk\"")

            circularlist.insert(3, "physical")
            assert.equal(circularlist.head, "jiminy", "Head should be \"jiminy\"")
            assert.equal(circularlist.tail, "tyrannosaurus", "Tail should be \"tyrannosaurus\"")
            assert.equal(circularlist.size, 5, "Size should be 5")
            assert.equal(circularlist.iterator, "junk", "Iterator should be \"junk\"")
        })
        it("remove", function () {
            circularlist.push("junk")
            circularlist.push("hippopotamus")
            circularlist.push("tyrannosaurus")
            circularlist.push("meager")
            circularlist.push("ubiquitous")
            circularlist.push("gerrymander")

            circularlist.remove(5)
            circularlist.remove(1)
            circularlist.remove(0)
            assert.equal(circularlist.head, "tyrannosaurus", "Head should be \"tyrannosaurus\"")
            assert.equal(circularlist.tail, "ubiquitous", "Tail should be \"ubiquitous\"")
            assert.equal(circularlist.size, 3, "Size should be 3")
            assert.equal(circularlist.iterator, "tyrannosaurus", "Iterator should be \"tyrannosaurus\"")
        })
        it("remove at iterator", function () {
            circularlist.push("junk")
            circularlist.push("hippopotamus")
            circularlist.push("tyrannosaurus")
            circularlist.push("meager")
            circularlist.push("ubiquitous")
            circularlist.push("gerrymander")

            circularlist.removeAtIterator()
            circularlist.next()
            circularlist.next()
            circularlist.next()
            circularlist.next()
            circularlist.removeAtIterator()

            assert.equal(circularlist.head, "hippopotamus", "Head should be \"hippopotamus\"")
            assert.equal(circularlist.tail, "ubiquitous", "Tail should be \"ubiquitous\"")
            assert.equal(circularlist.size, 4, "Size should be 4")
            assert.equal(circularlist.iterator, "hippopotamus", "Iterator should be \"hippopotamus\"")
        })
    })
})