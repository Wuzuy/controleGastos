let listaDeGastos = JSON.parse(localStorage.getItem("gastos")) || [];
let relatorioDeGastos = JSON.parse(localStorage.getItem("relatorio")) || [];

window.onload = function () {
    if (document.getElementById("listaGastos")) {
        atualizarLista();
    }
};

function logar() {
    var usuario = document.getElementById("usuario").value;
    var senha = document.getElementById("senha").value;

    if (usuario === "adminSfm258*" && senha === "Sfm258*") {
        alert("Login realizado com sucesso");
        window.location.href = "controleGastos.html";
    } else {
        alert("Login ou senha inválidos");
    }
}

function adicionarGasto() {
    const nomeGasto = document.getElementById("nomeGasto").value;
    const valorGasto = parseFloat(document.getElementById("valorGasto").value);

    if (nomeGasto === "" || isNaN(valorGasto)) {
        alert("Por favor, preencha o nome e o valor do gasto corretamente.");
        return;
    }

    const novoGasto = {
        nome: nomeGasto,
        valor: valorGasto
    };

    listaDeGastos.unshift(novoGasto);
    localStorage.setItem("gastos", JSON.stringify(listaDeGastos));

    document.getElementById("nomeGasto").value = "";
    document.getElementById("valorGasto").value = "";

    adicionarRegistro(nomeGasto, valorGasto, "Adicionado");
}

function adicionarRegistro(nome, valor, acao) {
    const data = new Date().toLocaleDateString() + " - " + new Date().toLocaleTimeString();
    const novoRegistro = {
        nome: nome,
        valor: valor,
        data: data,
        acao: acao
    }

    relatorioDeGastos.unshift(novoRegistro);
    localStorage.setItem("relatorio", JSON.stringify(relatorioDeGastos));

    atualizarLista();
    somarTotal();
}

function atualizarLista() {
    const listaGastos = document.getElementById("listaGastos");
    const relatorioGastos = document.getElementById("relatorioGastos");
    listaGastos.innerHTML = "";
    relatorioGastos.innerHTML = "";

    listaDeGastos.forEach(gasto => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${gasto.nome}</td>
            <td>R$ ${gasto.valor.toFixed(2)}</td>
            <td><button onclick="editarGasto('${gasto.nome}')" id="editar-btn">Editar</button>
            <td><button onclick="removerGasto('${gasto.nome}')" id="remover-btn">Remover</button>
            </td>
        `;
        listaGastos.appendChild(tr);
    });

    relatorioDeGastos.forEach(registro => {
        const tr = document.createElement("tr");
        tr.innerHTML = `    
            <td>${registro.data}</td>
            <td>${registro.nome}</td>
            <td>R$ ${registro.valor.toFixed(2)}</td>
            <td>${registro.acao}</td>
        `;
        relatorioGastos.appendChild(tr);
    });

    somarTotal();
}

function editarGasto(nome) {
    const gasto = listaDeGastos.find(g => g.nome === nome);
    if (gasto) {
        const novoNome = prompt("Digite o novo nome do gasto:", gasto.nome);
        const novoValor = parseFloat(prompt("Digite o novo valor do gasto:", gasto.valor));
        if (novoNome && !isNaN(novoValor)) {
            gasto.nome = novoNome;
            gasto.valor = novoValor;
            localStorage.setItem("gastos", JSON.stringify(listaDeGastos));
            adicionarRegistro(gasto.nome + " -> " + novoNome, novoValor, "Editado");
        }
    }
}

function removerGasto(nome) {
    listaDeGastos = listaDeGastos.filter(gasto => gasto.nome !== nome);
    localStorage.setItem("gastos", JSON.stringify(listaDeGastos));
    adicionarRegistro(nome, 0, "Removido");
}

function somarTotal() {
    const valorTotal = document.getElementById("valorTotal");
    const total = listaDeGastos.reduce((acc, gasto) => acc + gasto.valor, 0);
    valorTotal.textContent = `R$ ${total.toFixed(2)}`;
}