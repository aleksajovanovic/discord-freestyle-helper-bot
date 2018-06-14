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
        _next: {
            value = undefined,
            writable = true,
            enumerable = false,
            configurable = false,
            get: function () { return _next && _next.data; }
        },
        _prev: {
            value = undefined,
            writable = true,
            enumerable = false,
            configurable = false,
            get: function () { return _prev && _prev.data; }
        }
    })
}

module.exports.prototype.push = function (data) {
    this._tail = new Node(data, this._tail, this._tail)

    if (this._size === 0) {
        this._head = this._tail
        this._next = this._head
        this._prev = this._prev
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

    if(this._size === 1) {
        this._head = this._tail = this._prev = this._next = undefined
        this._size--
        return tail.data
    }

    this._head.prev = tail.prev
    this._tail = tail.prev
    this._tail.next = this._head
    this._size--
    return tail.data
}

function Node(data, prev, next) {
    this.next = next
    if (next) next.prev = this
    this.prev = prev
    if (prev) prev.next = this
    this.data = data
}