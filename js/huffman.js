class Freq {
    pos;
    value;
    next;

    constructor(value, pos) {
        this.pos = pos;
        this.value = value;

        this.next = null;
    }
}

class ListFreq {

    head;

    constructor() {
        this.head = null;
    }

    add(value, pos) {

        let newNode = new Freq(value, pos);

        if (this.head != null) {
            let tail = this.getTail();
            tail.next = newNode;
        } else {
            this.head = newNode;
        }
    }

    removeMin() {
        let removed = this.head;
        let prev = null;

        if (this.head != null) {
            let temp = this.head;

            while (temp.next != null) {
                if (temp.next.value < removed.value) {
                    prev = temp;
                    removed = temp.next;
                }
                temp = temp.next;
            }

            if (prev == null && removed.next == null) {//es el unico
                removed = this.head;
                this.head = null;
            } else if (prev == null) {//es el primero
                removed = this.head;
                this.head = removed.next;
                removed.next = null;
            } else {//esta en algun punto de la cola
                prev.next = removed.next;
                removed.next = null;
            }
        }

        return removed;


    }

    getTail() {
        let tail = this.head;

        if (this.head != null) {
            while (tail.next != null) {
                tail = tail.next;
            }
        }

        return tail;
    }
}

class Node {
    pos;
    symbol;
    freq;

    parent;
    type;
    left;
    right;

    constructor(symbol, freq, pos) {
        this.pos = pos;
        this.symbol = symbol;
        this.freq = freq;

        this.parent = null;
        this.type = null;
        this.left = null;
        this.right = null;

        this.next = null;
    }
}

class Huffman {
    msg;
    arrayNodes;
    headTree;

    tableMatrix;
    tableAddress;
    tableMsgCode;

    objInfo;

    constructor(msg) {
        this.msg = msg;
        this.headTree = null;
        this.arrayNodes = [];

        this.tableMatrix = [];
        this.tableAddress = [];
        this.tableMsgCode = [];

        this.objInfo = {};

        this.setTree();
        this.setMatrix();
        this.setAddress(this.headTree, '')
        this.setMsgCode();
        this.setinfo();
    }

    quickSort(list, low, high) {
        if (low < high) {
            let pivot = list[high];
            let i = (low - 1);

            for (let j = low; j < high; j++) {
                if (list[j] < pivot) {

                    i++;
                    let temp = list[i];
                    list[i] = list[j];
                    list[j] = temp;
                }
            }

            let temp = list[i + 1];
            list[i + 1] = list[high];
            list[high] = temp;

            let pi = i + 1;
            this.quickSort(list, low, pi - 1);
            this.quickSort(list, pi + 1, high);
        }

        return list;
    }

    fullMsgToAsciiArray() {
        let charArray = [];
        for (let i = 0; i < this.msg.length; i++) {
            charArray[i] = this.msg.charCodeAt(i);
        }

        return charArray;
    }


    msgToAsciiArray() {
        let charArray = this.fullMsgToAsciiArray();
        charArray = this.quickSort(charArray, 0, charArray.length - 1);

        let finalArray = [];
        for (let i = 0; i < charArray.length; i++) {
            if (i == 0 || charArray[i] != charArray[i - 1]) {
                finalArray.push(charArray[i]);
            }
        }

        return finalArray;
    }

    countFreqInMsg(char) {

        let count = 0;
        for (let i = 0; i < this.msg.length; i++) {
            if (this.msg.charCodeAt(i) == char) {
                count++;
            }
        }
        return count;
    }

    //SET DATA
    setTree() {
        let listFreqs = new ListFreq();
        let arrayAscii = this.msgToAsciiArray();

        for (let i = 0; i < arrayAscii.length * 2 - 1; i++) {
            if (i < arrayAscii.length) {
                listFreqs.add(this.countFreqInMsg(arrayAscii[i]), i);
                this.arrayNodes[i] = new Node(arrayAscii[i], this.countFreqInMsg(arrayAscii[i]), i);
            } else {
                let val1 = listFreqs.removeMin();
                let val2 = listFreqs.removeMin();

                listFreqs.add(val1.value + val2.value, i);

                this.arrayNodes[i] = new Node(null, val1.value + val2.value, i);
                this.arrayNodes[i].left = this.arrayNodes[val1.pos];
                this.arrayNodes[i].right = this.arrayNodes[val2.pos];
                this.arrayNodes[val1.pos].parent = this.arrayNodes[i];
                this.arrayNodes[val1.pos].type = 1;
                this.arrayNodes[val2.pos].parent = this.arrayNodes[i];
                this.arrayNodes[val2.pos].type = 2;
            }
        }

        this.headTree = this.arrayNodes[this.arrayNodes.length - 1];
    }

    setMatrix() {
        this.tableMatrix = [];
        for (let i = 0; i < this.arrayNodes.length; i++) {
            let row = [];
            row[0] = this.arrayNodes[i].pos;
            row[1] = (this.arrayNodes[i].symbol != null ? String.fromCharCode(this.arrayNodes[i].symbol) : '');
            row[2] = this.arrayNodes[i].freq;
            row[3] = (this.arrayNodes[i].parent != null ? this.arrayNodes[i].parent.pos : '');
            row[4] = (this.arrayNodes[i].type != null ? this.arrayNodes[i].type : '');
            row[5] = (this.arrayNodes[i].left != null ? this.arrayNodes[i].left.pos : '');
            row[6] = (this.arrayNodes[i].right != null ? this.arrayNodes[i].right.pos : '');
            this.tableMatrix.push(row);
        }
    }


    setAddress(head, address) {
        this.tableAddress;
        if (head.left == null && head.right == null) {
            this.tableAddress[head.pos] = [head.symbol, address];
        } else {
            (head.left != null ? this.setAddress(head.left, address + '0') : '');
            (head.right != null ? this.setAddress(head.right, address + '1') : '');
        }

    }

    setMsgCode() {
        let charArray = this.fullMsgToAsciiArray();

        this.tableMsgCode = [];
        for (let i = 0; i < charArray.length; i++) {

            for (let j = 0; j < this.tableAddress.length; j++) {
                if (this.tableAddress[j][0] == charArray[i]) {
                    this.tableMsgCode.push(this.tableAddress[j]);
                }
            }

        }
    }

    setinfo() {
        let initBits = this.tableMsgCode.length * 8;
        let finalBits = 0;
        for (let i = 0; i < this.tableMsgCode.length; i++) {
            finalBits += this.tableMsgCode[i][1].length;
        }

        let usedPercent = finalBits * 100 / initBits;
        let freePercent = 100 - usedPercent;

        this.objInfo = {};
        this.objInfo.initChars = this.msg.length;
        this.objInfo.usedChars = this.msgToAsciiArray().length;
        this.objInfo.initBits = initBits;
        this.objInfo.finalBits = finalBits;
        this.objInfo.difBits = initBits - finalBits;
        this.objInfo.usedPercent = Math.round((usedPercent + Number.EPSILON) * 100) / 100;
        this.objInfo.freePercent = Math.round((freePercent + Number.EPSILON) * 100) / 100;
    }

    //HTML
    treeHTML(head) {
        let html = '';

        if (head === null) {
            return '<li><span class="px-2 py-1">*</span></li>';
        } else {
            let htmlLeft = this.treeHTML(head.left);
            let htmlRight = this.treeHTML(head.right);

            html = '<li>' +
                '<div class="rounded-pill px-2 py-1">' +
                (head.symbol != null ? String.fromCharCode(head.symbol) : head.freq) +
                '</div>';

            if (!(head.left === null && head.right === null)) {

                html += '<ul>' +
                    htmlLeft +
                    htmlRight +
                    '</ul>' +
                    '</li>';
            }

            html += '</li>';
        }

        return html;
    }

    matrixHTML() {
        let html = '';
        for (let i = 0; i < this.tableMatrix[0].length; i++) {
            let row = '<tr>';

            switch (i) {
                case 0:
                    row += "<th>Posición</th>";
                    break;
                case 1:
                    row += "<th>Símbolo</th>";
                    break;
                case 2:
                    row += "<th>Frecuencia</th>";
                    break;
                case 3:
                    row += "<th>Padre</th>";
                    break;
                case 4:
                    row += "<th>Tipo</th>";
                    break;
                case 5:
                    row += "<th>Izquierdo</th>";
                    break;
                case 6:
                    row += "<th>Derecho</th>";
                    break;
            }

            for (let j = 0; j < this.tableMatrix.length; j++) {

                row += '<td>' + this.tableMatrix[j][i] + '</td>';
            }
            row += '</tr>';
            html += row;
        }

        return html
    }

    addressHTML() {
        let html = '';
        for (let i = 0; i < this.tableAddress[0].length; i++) {
            let row = '<tr>';

            for (let j = 0; j < this.tableAddress.length; j++) {
                row += (i == 0 ? '<th>' + String.fromCharCode(this.tableAddress[j][i]) + '</th>' : '<td>' + this.tableAddress[j][i]) + '</td>';
            }
            row += '</tr>';
            html += row;
        }


        return html;
    }

    msgCodeHTML() {
        let html = '';
        for (let i = 0; i < this.tableMsgCode[0].length; i++) {
            let row = '<tr>';
            for (let j = 0; j < this.tableMsgCode.length; j++) {
                row += (i == 0 ? '<th>' + String.fromCharCode(this.tableMsgCode[j][i]) + '</th>' : '<td>' + this.tableMsgCode[j][i] + '</td>');
            }
            row += '</tr>';
            html += row;
        }

        return html;

    }
}

function startHuffman() {
    if ($('#msgTxt').val() != '' && $('#msgTxt').val().length > 1) {
        let huffman = new Huffman($('#msgTxt').val());
        $('#treeUl').html(huffman.treeHTML(huffman.headTree));
        $('#matrixTable').html(huffman.matrixHTML());
        $('#addressTable').html(huffman.addressHTML());
        $('#msgCodeTable').html(huffman.msgCodeHTML());
        $('#msgCodeTable').html(huffman.msgCodeHTML());
        $('#initChars').html(huffman.objInfo.initChars);
        $('#usedChars').html(huffman.objInfo.usedChars);
        $('#initBits').html(huffman.objInfo.initBits);
        $('#finalBits').html(huffman.objInfo.finalBits);
        $('#difBits').html(huffman.objInfo.difBits);
        $('#usedPercent').html(huffman.objInfo.usedPercent);
        $('#freePercent').html(huffman.objInfo.freePercent);
        $('#progressBar').attr('style', 'width:' + huffman.objInfo.usedPercent + '%')
        $('#progressBar').html(huffman.objInfo.usedPercent + "%");
        $('#freeBar').attr('style', 'width:' + huffman.objInfo.freePercent + '%')
        $('#freeBar').html(huffman.objInfo.freePercent + "%");
    } else {
        $('#matrixTable').html('');
        $('#treeUl').html('');
        $('#addressTable').html('');
        $('#msgCodeTable').html('');
        $('#initChars').html(0);
        $('#usedChars').html(0);
        $('#initBits').html(0);
        $('#finalBits').html(0);
        $('#difBits').html(0);
        $('#usedPercent').html(0);
        $('#freePercent').html(0);
        $('#progressBar').attr('style', 'width:0%')
        $('#progressBar').html('0%');
        $('#freeBar').attr('style', 'width:0%')
        $('#freeBar').html('0%');
        alert('Ingrese un dato valido');
    }
}
