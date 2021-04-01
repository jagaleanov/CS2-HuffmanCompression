class Freq {
    value;
    pos;
    next;

    /**
     * @desc constructor
    */
    constructor(value, pos) {
        this.pos = pos;
        this.value = value;

        this.next = null;
    }
}

class ListFreq {

    head;

    /**
     * @desc constructor
    */
    constructor() {
        this.head = null;
    }

    /**
      * @desc método para añadir una frecuencia en un nuevo nodo de la lista
      * @param int value - valor de la frecuencia
      * @param int pos - posicion del nodo en la matriz
      * @return void
    */
    add(value, pos) {

        let newNode = new Freq(value, pos);

        if (this.head != null) {
            let tail = this.getTail();
            tail.next = newNode;
        } else {
            this.head = newNode;
        }
    }

    /**
      * @desc método que devuelve el nodo de menor frecuencia y lo elimina de la lista
      * @return Freq - el nodo eliminado
    */
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

    /**
      * @desc método que devuelve el último nodo en la lista
      * @return Freq - el último nodo
    */
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

    /**
     * @desc constructor
    */
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
    msg;            //almacena el string del mensaje inicial
    arrayNodes;     //almacena la lista de nodos
    headTree;       //almacena la cabeza del árbol

    tableMatrix;    //almacena los datos de la matriz
    tableAddress;   //almacena los datos de la tabla de direcciones
    tableMsgCode;   //almacena los datos de la tabla de traducción del mensaje

    objInfo;        //almacena los datos de info
    encriptedMsg;   //almacena el mensaje encriptado

    /**
     * @desc constructor
    */
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

    //HELPERS
    /**
     * @desc método recursivo que ordena un arreglo de números
     * @param array array - el arreglo a ordenar
     * @param int low - posicion inicial (0)
     * @param int high - posicion final (length - 1)
     * @return array - el arreglo ordenado 
    */
    quickSort(array, low, high) {
        if (low < high) {
            let pivot = array[high];
            let i = (low - 1);

            for (let j = low; j < high; j++) {
                if (array[j] < pivot) {

                    i++;
                    let temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
            }

            let temp = array[i + 1];
            array[i + 1] = array[high];
            array[high] = temp;

            let pi = i + 1;
            this.quickSort(array, low, pi - 1);
            this.quickSort(array, pi + 1, high);
        }

        return array;
    }

    /**
     * @desc método que convierte el string del mensaje en un arreglo de números ascii
     * @return array - el arreglo de números 
    */
    fullMsgToAsciiArray() {
        let charArray = [];
        for (let i = 0; i < this.msg.length; i++) {//por cada caracter en el mensaje
            charArray[i] = this.msg.charCodeAt(i);//extraer el valor del caracter en ascii y almacenarlo en un arreglo
        }

        return charArray;
    }

    /**
     * @desc método que devuelve un arreglo ordenado de números ascii usados en el mensaje
     *  @return array - el arreglo de números 
    */
    msgToAsciiArray() {
        let charArray = this.fullMsgToAsciiArray();//toma el mensaje en ascii
        charArray = this.quickSort(charArray, 0, charArray.length - 1);//y lo ordena

        let finalArray = [];
        for (let i = 0; i < charArray.length; i++) {//por cada caracter en el arreglo ordenado
            if (i == 0 || charArray[i] != charArray[i - 1]) {//si es el primer caracter o el anterior 
                //es un caracter diferente (no esta repetido)
                finalArray.push(charArray[i]);//almacenar el caracter en un arreglo
            }
        }

        return finalArray;
    }

    /**
     * @desc método que cuenta las apariciones de un número ascii en el mensaje
     * @param int char - el número del caracter a buscar
     * @return int - cantidad de apariciones 
    */
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
    /**
     * @desc método que construye el árbol a partir del mensaje dado
     * @return void
    */
    setTree() {
        let listFreqs = new ListFreq();
        let arrayAscii = this.msgToAsciiArray();//caracteres ascii usados en el mensaje

        for (let i = 0; i < arrayAscii.length * 2 - 1; i++) {//crear las columnas de la mastriz (tamaño *2 -1)
            if (i < arrayAscii.length) {//si es un nodo hoja

                //añadirlo a lista de frecuencias y a la lista de nodos
                listFreqs.add(this.countFreqInMsg(arrayAscii[i]), i);
                this.arrayNodes[i] = new Node(arrayAscii[i], this.countFreqInMsg(arrayAscii[i]), i);

            } else {//si es un nodo intermedio

                //encontrar en la lista de frecuencias las dos de menor valor
                let val1 = listFreqs.removeMin();
                let val2 = listFreqs.removeMin();

                listFreqs.add(val1.value + val2.value, i);//añadir a la lista de frecuencias la suma de las dos menores

                this.arrayNodes[i] = new Node(null, val1.value + val2.value, i);//crear el nuevo nodo y añadirlo al array de nodos 

                //asignar nodos izquierdo y derecho
                this.arrayNodes[i].left = this.arrayNodes[val1.pos];
                this.arrayNodes[i].right = this.arrayNodes[val2.pos];

                //asignar padres y tipo al nodo izquierdo
                this.arrayNodes[val1.pos].parent = this.arrayNodes[i];
                this.arrayNodes[val1.pos].type = 1;

                //asignar padres y tipo al nodo derecho
                this.arrayNodes[val2.pos].parent = this.arrayNodes[i];
                this.arrayNodes[val2.pos].type = 2;
            }
        }

        //el último nodo es la cabeza del arbol y por ser el último tiene todas las relaciones asignadas
        this.headTree = this.arrayNodes[this.arrayNodes.length - 1];
    }

    /**
     * @desc método que construye la matriz a partir del arreglo de nodos
     * @return void
    */
    setMatrix() {
        this.tableMatrix = [];
        for (let i = 0; i < this.arrayNodes.length; i++) {//por cada elemento en la lista de nodos
            let row = [];//generar un arreglo fila

            //llenar las columnas
            row[0] = this.arrayNodes[i].pos;
            row[1] = (this.arrayNodes[i].symbol != null ? String.fromCharCode(this.arrayNodes[i].symbol) : '');
            row[2] = this.arrayNodes[i].freq;
            row[3] = (this.arrayNodes[i].parent != null ? this.arrayNodes[i].parent.pos : '');
            row[4] = (this.arrayNodes[i].type != null ? this.arrayNodes[i].type : '');
            row[5] = (this.arrayNodes[i].left != null ? this.arrayNodes[i].left.pos : '');
            row[6] = (this.arrayNodes[i].right != null ? this.arrayNodes[i].right.pos : '');
            this.tableMatrix.push(row);//añadir la fila a la tabla matriz
        }
    }

    /**
     * @desc método recursivo que recorre el árbol y construye la tabla de direcciones
     * @param Node head - la cabeza del árbol
     * @param string address - '' (vacio)
     * @return void
    */
    setAddress(head, address) {
        if (head.left == null && head.right == null) {//si es una hoja
            this.tableAddress[head.pos] = [head.symbol, address];//almacenar la dirección
        } else {//si es nodo intermedio
            (head.left != null ? this.setAddress(head.left, address + '0') : '');//analizar izquierda añadiendo un 0 a la dirección
            (head.right != null ? this.setAddress(head.right, address + '1') : '');//analizar derecha añadiendo un 1 a la dirección
        }
    }

    /**
     * @desc método que codifica el mensaje a partir de la tabla de direcciones
     * @return void
    */
    setMsgCode() {
        let charArray = this.fullMsgToAsciiArray();//llamar el mensaje en un arreglo

        this.tableMsgCode = [];
        for (let i = 0; i < charArray.length; i++) {//por cada caracter en el mensaje

            for (let j = 0; j < this.tableAddress.length; j++) {//por cada elemento en la tabla de direcciones
                if (this.tableAddress[j][0] == charArray[i]) {//si coinciden
                    this.tableMsgCode.push(this.tableAddress[j]);//almacenar en un arreglo
                }
            }
        }
    }

    /**
     * @desc método que genera datos informativos del proceso
     * @return void
    */
    setinfo() {
        let initBits = this.tableMsgCode.length * 8;//bits iniciales
        let finalBits = 0;

        //contar bits finales
        for (let i = 0; i < this.tableMsgCode.length; i++) {
            finalBits += this.tableMsgCode[i][1].length;
        }

        let usedPercent = finalBits * 100 / initBits;//porcentaje usado
        let freePercent = 100 - usedPercent;//espacio liberado

        //concatenar el mensaje encriptado
        this.encriptedMsg = '';
        for (let i = 0; i < this.tableMsgCode.length; i++) {
            this.encriptedMsg += this.tableMsgCode[i][1];
        }

        this.objInfo = {};
        this.objInfo.msg = this.msg;
        this.objInfo.encriptedMsg = this.encriptedMsg;
        this.objInfo.decriptedMsg = this.decode();
        this.objInfo.initChars = this.msg.length;
        this.objInfo.usedChars = this.msgToAsciiArray().length;
        this.objInfo.initBits = initBits;
        this.objInfo.finalBits = finalBits;
        this.objInfo.difBits = initBits - finalBits;//espacio liberado en bits
        this.objInfo.usedPercent = Math.round((usedPercent + Number.EPSILON) * 100) / 100;//porcentaje usado redondeado
        this.objInfo.freePercent = Math.round((freePercent + Number.EPSILON) * 100) / 100;//porcentaje liberado redondeado
    }

    /**
     * @desc método que descifra el mensaje a partir de la tabla de direcciones
     * @return mensaje decodificado
    */
    decode() {
        let temp = '';
        let decoded = '';
        for (let i = 0; i < this.encriptedMsg.length; i++) {//por cada caracter en el mensaje cifrado
            temp += this.encriptedMsg.charAt(i);//almacenarlo en un string temporal
            for (let j = 0; j < this.tableAddress.length; j++) {//por cada elemento en la tabla de direcciones
                if (this.tableAddress[j][1] == temp) {//si coinciden el temporal y alguna dirección
                    decoded += String.fromCharCode(this.tableAddress[j][0]);//almacenar en un string
                    temp = '';//reiniciar el temporal
                    break;//y finalizar el bucle interior
                }
            }
        }

        return decoded;
    }

    //get HTML
    /**
     * @desc método recursivo que recorre el árbol y construye el html para ser impreso
     * @param Node head - cabeza del árbol
     * @return string html 
    */
    treeHTML(head) {
        let html = '';

        if (head === null) {
            return '<li><span class="px-2 py-1">*</span></li>';
        } else {
            let htmlLeft = this.treeHTML(head.left);
            let htmlRight = this.treeHTML(head.right);

            html = '<li>' +
                '<div class="rounded-pill px-2 py-1" '+(head.symbol == null?'style="font-size: 0.9rem"':'')+'>' +
                (head.symbol != null ? (head.symbol == 32 ? '&nbsp' : String.fromCharCode(head.symbol)) : head.freq) +
                '</div>';

            if (head.left != null || head.right != null) {

                html += '<ul>' +
                    htmlLeft +
                    htmlRight +
                    '</ul>';
            }

            html += '</li>';
        }

        return html;
    }

    /**
     * @desc método que recorre la matriz y construye el html para ser impresa
     * @return string html 
    */
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

    /**
     * @desc método que recorre la tabla de direcciones y construye el html para ser impresa
     * @return string html 
    */
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

    /**
     * @desc método que recorre la tabla de traducción del mensaje y construye el html para ser impreso
     * @return string html 
    */
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

/**
 * @desc función que busca el mensaje ingresado en el formulario, instancia huffman e imprime los resultados
 * @return void
*/
function startHuffman() {
    if ($('#msgTxt').val().length > 1) {//si el mensaje en el campo tiene más de un caracter
        let huffman = new Huffman($('#msgTxt').val());
        $('#treeUl').html(huffman.treeHTML(huffman.headTree));
        $('#matrixTable').html(huffman.matrixHTML());
        $('#addressTable').html(huffman.addressHTML());
        $('#msgCodeTable').html(huffman.msgCodeHTML());
        $('#msgCodeTable').html(huffman.msgCodeHTML());

        $('#msg').html(huffman.objInfo.msg);
        $('#encriptedMsg').html(huffman.objInfo.encriptedMsg);
        $('#decriptedMsg').html(huffman.objInfo.decriptedMsg);

        $('#initChars').html(huffman.objInfo.initChars);
        $('#usedChars').html(huffman.objInfo.usedChars);
        $('#initBits').html(huffman.objInfo.initBits);
        $('#finalBits').html(huffman.objInfo.finalBits);
        $('#difBits').html(huffman.objInfo.difBits);
        $('#usedPercent').html(huffman.objInfo.usedPercent);
        $('#freePercent').html(huffman.objInfo.freePercent);

        $('#progressBar').attr('style', 'width:' + huffman.objInfo.usedPercent + '%');
        $('#progressBar').html(huffman.objInfo.usedPercent + "%");
        $('#freeBar').attr('style', 'width:' + huffman.objInfo.freePercent + '%');
        $('#freeBar').html(huffman.objInfo.freePercent + "%");
        $('#msgTxt').val('');
        $('#msgTxt').focus();
    } else {
        $('#matrixTable').html('');
        $('#treeUl').html('');
        $('#addressTable').html('');
        $('#msgCodeTable').html('');

        $('#msg').html('');
        $('#encriptedMsg').html('');
        $('#decriptedMsg').html('');

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
