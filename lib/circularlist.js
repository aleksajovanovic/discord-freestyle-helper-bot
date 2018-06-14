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
        _current: {
            value = undefined,
            writable = true,
            enumerable = false,
            configurable = false,
            get: function () { return _current && _current.data; }
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
        this._current = this._head
        this._next = this._head
        this._prev = this._prev
    }
    else {
        this._tail.next = this._head
        this._head.prev = this._tail
        this._current = this._tail
    }

    this._size += 1
}

function Node(data, prev, next) {
    this.next = next
    if (next) next.prev = this
    this.prev = prev
    if (prev) prev.next = this
    this.data = data
}