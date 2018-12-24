module.exports = function () {
    Object.defineProperties(this, {
        _head: {
            value: undefined,
            writable: true,
            enumerable: false,
            configurable: false,
        },
        _tail: {
            value: undefined,
            writable: true,
            enumerable: false,
            configurable: false,
        },
        _size: {
            value: 0,
            writable: true,
            enumerable: false,
            configurable: false,
        },
        _iterator: {
            value: undefined,
            writable: true,
            enumerable: false,
            configurable: false,
        }
    })
}

module.exports.prototype.__defineGetter__('head', function () {
    return this._head && this._head.data
})
  
module.exports.prototype.__defineGetter__('tail', function () {
    return this._tail && this._tail.data
})
  
module.exports.prototype.__defineGetter__('iterator', function () {
    return this._iterator && this._iterator.data
})
  
module.exports.prototype.__defineGetter__('size', function () {
    return this._size
})

module.exports.prototype.push = function (data) {
    this._tail = new Node(data, this._tail, this._head)

    if (this._size === 0) {
        this._head = this._tail
        this._head.next = this._head
        this._head.prev = this._head
        this._iterator = this._head
    }
    else {
        this._head.prev = this._tail
        this._tail.prev.next = this._tail
    }

    this._size++
}

module.exports.prototype.pop = function () {
    var tail = this._tail

    if (this._size === 0)
        return

    if (this._size === 1) {
        this._head = this._tail = this._iterator = undefined
        this._size--
        return tail.data
    }

    if (this._iterator === this._tail)
        this._iterator = this._tail.next

    this._head.prev = tail.prev
    this._tail = tail.prev
    this._tail.next = this._head
    this._size--

    return tail.data
}


module.exports.prototype.rotate = function () {
    if (this._size > 0) { 
        this._tail = this._tail.next
        this._head = this._head.next
        this._iterator = this._head
    }
}

module.exports.prototype.unrotate = function () {
    if (this._size > 0) { 
        this._tail = this._tail.prev
        this._head = this._head.prev
        this._iterator = this._head
    }
}

module.exports.prototype.set = function (index, data) {
    if (index < 0 || index >= this._size) throw new Error('Index "' + index + '" out of bounds')

    var node = this._head

    while (index != 0) {
        node = node.next
        index--
    }

    var oldData = node.data
    node.data = data

    return oldData
}

module.exports.prototype.get = function (index) {
    if (index < 0 || index >= this._size) throw new Error('Index "' + index + '" out of bounds')

    var node = this._head

    while (index != 0) {
        node = node.next
        index--
    }

    return node.data
}

module.exports.prototype.exists = function (obj) {
    if (obj === null || this._size < 1) return false

    next = this._head
    nextId = next.data['userID']
    objId = obj['userID']

    if (nextId !== objId && this._size == 1) return false
    
    index = this._size

    while (index != 0) {
        if (nextId === objId) return true
        next = next.next
        nextId = next.data['userID']
        index--
    }

    return false
}

module.exports.prototype.insert = function (index, data) {
    if (index < 0 || index >= this._size) throw new Error('Index "' + index + '" out of bounds')

    var newNode = new Node(data, undefined, undefined)
    var node = this._head

    while (index != 0) {
        node = node.next
        index--
    }

    if (this._head === node)
        this._head = newNode

    newNode.next = node
    newNode.prev = node.prev
    node.prev.next = newNode
    node.prev = newNode
    this._size++
}

module.exports.prototype.remove = function (index) {
    if (index < 0 || index >= this._size) throw new Error('Index "' + index + '" out of bounds')

    var node = this._head

    if (this._size === 1) {
        this._head = this._tail = this._iterator = undefined
        this._size--
        return node.data
    }

    while (index != 0) {
        node = node.next
        index--
    }

    if (this._iterator === node)
        this._iterator = node.next
    if (this._head === node)
        this._head = node.next
    if (this._tail === node)
        this._tail = node.prev

    node.prev.next = node.next
    node.next.prev = node.prev
    this._size--

    return node.data
}

module.exports.prototype.removeAtIterator = function () {
    if (this._size === 0)
        return

    var node = this._iterator

    if (this._size === 1) {
        this._head = this._tail = this._iterator = undefined
        this._size--
        return node.data
    }

    if (this._head === node)
        this._head = node.next
    if (this._tail === node)
        this._tail = node.prev

    node.prev.next = node.next
    node.next.prev = node.prev
    this._iterator = node.next
    this._size--

    return node.data
}

module.exports.prototype.next = function () {
    if (this._size > 0)
        this._iterator = this._iterator.next

    return this._iterator.data
}

module.exports.prototype.prev = function () {
    if (this._size > 0)
        this._iterator = this._iterator.prev
    
    return this._iterator.data
}

module.exports.prototype.resetIterator = function () {
    this._iterator = this._head
}

function Node (data, prev, next) {
    this.next = next
    if (next) next.prev = this
    this.prev = prev
    if (prev) prev.next = this
    this.data = data
}