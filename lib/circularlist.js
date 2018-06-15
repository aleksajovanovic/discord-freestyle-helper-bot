module.exports = function () {
    Object.defineProperties(this, {
        _head: {
            value = undefined,
            writable = true,
            enumerable = false,
            configurable = false,
            get: function () { return _head && _head.data; }
        },
        _tail: {
            value = undefined,
            writable = true,
            enumerable = false,
            configurable = false,
            get: function () { return _tail && _tail.data; }
        },
        _size: {
            value = 0,
            writable = true,
            enumerable = false,
            configurable = false,
        },
        _iterator: {
            value = undefined,
            writable = true,
            enumerable = false,
            configurable = false,
            get: function () { return _next && _next.data; }
        }
    })
}

module.exports.prototype.push = function (data) {
    this._tail = new Node(data, this._tail, this._head)

    if (this._size === 0) {
        this._head = this._tail
        this._head.next = this._head
        this._head.prev = this._head
        this._iterator = this._head
    }
    else {
        this._tail.next = this._head
        this._head.prev = this._tail
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
        this._iterator = this._head

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
    }
}

module.exports.prototype.unrotate = function () {
    if (this._size > 0) { 
        this._tail = this._tail.prev
        this._head = this._head.prev
    }
}

module.exports.prototype.set = function (index, data) {
    if (index < 0 || index > this._size) throw new Error('Index "' + index + '" out of bounds')

    var node = this._head

    while (index != 0) {
        node = node.next
        index--
    }

    node.data = data
}

module.exports.prototype.remove = function (index) {
    if (index < 0 || index > this._size) throw new Error('Index "' + index + '" out of bounds')

    var node = this._head

    while (index != 0) {
        node = node.next
        index--
    }

    node.prev.next = node.next
    node.next.prev = node.prev
}

function Node(data, prev, next) {
    this.next = next
    if (next) next.prev = this
    this.prev = prev
    if (prev) prev.next = this
    this.data = data
}