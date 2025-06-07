export function errorMessage(err: any) {
    if (err.status === 401){
        return "Sessão expirada. Faça login novamente";
    }

    else if (err.status === 429 && err.message.blocked)
        return `Você foi bloqueado por ${err.remaining} minutos por muitas ações consecutivas`;

    else if (err.status === 429){
        if(err.response.data.message === "blocked"){
            return `Você foi bloqueado por ${err?.response?.data?.remaining} minutos por muitas ações repetidas`;
        }
        
        if (err?.response?.data?.message)
            return err.response.data.message;

        return `Espere um momento para realizar essa ação`;
    }

    else if (err?.response?.data?.message) {
        return err.response.data.message;

    } else if (err?.response?.data.error) {
        return err.response.data.error || "Erro no servidor!";

    } else if (err.response?.data.erro) { //gerencianet
        return err.response.data.erro;

    } else if (err.request) {
        if(err.code === "ERR_NETWORK")
            return "Verifique sua conexão de internet"

        return "Servidor não respondeu. Tente novamente mais tarde";
    } else {
        return "Ocorreu um erro inesperado. Tente novamente mais tarde";
    }
}

export function censorText(text: string) {
    blacklist.forEach((word) => {
        const pattern = new RegExp(`\\b${word}\\b`, 'gi');
        const replacement = `${word.charAt(0)}${'*'.repeat(word.length - 1)}`;
        text = text.replace(pattern, replacement);
    });
    return text;
}

export function hasOffensiveWords(text: string) {
    return blacklist.some((word) => {
        const pattern = new RegExp(`\\b${word}\\b`, 'i');
        return pattern.test(text);
    });
}

export function isWebView(): boolean {
    const userAgent = navigator.userAgent || navigator.vendor;
    const isStandalone = (navigator as any).standalone; // Evita erro de TypeScript
  
    return (
      /FBAN|FBAV|Instagram|WebView|wv/i.test(userAgent) ||
      (isStandalone && navigator.platform === "iPhone")
    );
  }
  
export function clearText(text: string) {
    if(text){
        const padraoLink = /(https?:\/\/[^\s]+)/g;
        const padraoTagUser = /(?:\s|^)(@[a-zA-Z0-9_]+)/g;
        const padraoHashtag = /(?<!\S)(#[\wÀ-ÿ]+)/gu;

        text = escapeHtml(text);
        
        text = text.replace(padraoLink, (url) => `<a href='${url}' target='_blank' style='word-wrap: break-word;'>${url}</a>`);
        
        text = text.replace(padraoTagUser, (match) => {
            const username = match.trim().slice(1);
            return `<a href='/@${username}' style='word-wrap: break-word;'>${match}</a>`;
        });
        
        // Substitui múltiplos \n por um único \n
        text = text.replace(/\n{3,}/g, '\n');
        text = text.replace(/\n/g, '<br>');

        text = text.replace(padraoHashtag, (match) => {
            const hashtag = match.slice(1);
            return `<a href='/post/hashtag/${hashtag}' style='word-wrap: break-word;'>${match}</a>`;
        });

        return replaceEmojis(text);
    }
    return text;

}

export const emojis: Record<string, string> = {
    ':pacoca_coracao:': "<img src='/img/emoji/zack/coracao.png' class='emoji' alt=':pacoca_coracao:' data-title=':pacoca_coracao:' style='height: 27px;'>",
    ':pacoca_lingua:': "<img src='/img/emoji/zack/lingua.png' class='emoji' alt=':pacoca_lingua:' data-title=':pacoca_lingua:' style='height: 27px;'>",
    ':pacoca_mao:': "<img src='/img/emoji/zack/mao.png' class='emoji' alt=':pacoca_mao:' data-title=':pacoca_mao:' style='height: 27px;'>",
    ':pacoca_oculos1:': "<img src='/img/emoji/zack/oculos1.png' class='emoji' alt=':pacoca_oculos1:' data-title=':pacoca_oculos1:' style='height: 27px;'>",
    ':pacoca_vomito_arco_iris:': "<img src='/img/emoji/zack/vomito_arco_iris.png' class='emoji' alt=':pacoca_vomito_arco_iris:' data-title=':pacoca_vomito_arco_iris:' style='height: 27px;'>",
    ':pacoca_sorriso:': "<img src='/img/emoji/zack/sorriso.png' class='emoji' alt=':pacoca_sorriso:' data-title=':pacoca_sorriso:' style='height: 27px;'>",
    ':pacoca_palavrao:': "<img src='/img/emoji/zack/palavrao.png' class='emoji' alt=':pacoca_palavrao:' data-title=':pacoca_palavrao:' style='height: 27px;'>",
    ':pacoca_duvida:': "<img src='/img/emoji/zack/duvida.png' class='emoji' alt=':pacoca_duvida:' data-title=':pacoca_duvida:' style='height: 29px;'>",
    ':pacoca_choro1:': "<img src='/img/emoji/zack/choro.png' class='emoji' alt=':pacoca_choro1:' data-title=':pacoca_choro1:' style='height: 25px;'>",
    ':pacoca_canto:': "<img src='/img/emoji/zack/canto.png' class='emoji' alt=':pacoca_canto:' data-title=':pacoca_canto:' style='height: 25px;'>",
    ':pacoca_raiva1:': "<img src='/img/emoji/zack/raiva.png' class='emoji' alt=':pacoca_raiva1:' data-title=':pacoca_raiva1:' style='height: 25px;'>",
    ':pacoca_beijo_coracao:': "<img src='/img/emoji/zack/beijo_coracao.png' class='emoji' alt=':pacoca_beijo_coracao:' data-title=':pacoca_beijo_coracao:' style='height: 25px;'>",
    ':pacoca_uau:': "<img src='/img/emoji/zack/uau.png' class='emoji' alt=':pacoca_uau:' data-title=':pacoca_uau:' style='height: 25px;'>",
    ':pacoca_tremendo:': "<img src='/img/emoji/zack/tremendo.png' class='emoji' alt=':pacoca_tremendo:' data-title=':pacoca_tremendo:' style='height: 25px;'>",
    ':pacoca_dormindo:': "<img src='/img/emoji/zack/dormindo.png' class='emoji' alt=':pacoca_dormindo:' data-title=':pacoca_dormindo:' style='height: 25px;'>",
    ':pacoca_baba:': "<img src='/img/emoji/zack/baba.png' class='emoji' alt=':pacoca_baba:' data-title=':pacoca_baba:' style='height: 25px;'>",
    ':pacoca_lagrima:': "<img src='/img/emoji/zack/lagrima.png' class='emoji' alt=':pacoca_lagrima:' data-title=':pacoca_lagrima:' style='height: 25px;'>",
    ':pacoca_diabinho1:': "<img src='/img/emoji/zack/diabinho.png' class='emoji' alt=':pacoca_diabinho1:' data-title=':pacoca_diabinho1:' style='height: 26px;'>",
    ':pacoca_anjo1:': "<img src='/img/emoji/zack/anjo.png' class='emoji' alt=':pacoca_anjo1:' data-title=':pacoca_anjo1:' style='height: 26px;'>",
    ':pacoca_choro_riso:': "<img src='/img/emoji/zack/choro_riso.png' class='emoji' alt=':pacoca_choro_riso:' data-title=':pacoca_choro_riso:' style='height: 26px;'>",

    ':pacoca:': "<img src='/img/pacoca-sem-braco.png' class='emoji' alt=':pacoca:' data-title=':pacoca:' style='height: 25px; width: 25px'>",
    ':pacoca_corpo:': "<img src='/img/pacoca-com-braco.png' class='emoji' alt=':pacoca_corpo:' data-title=':pacoca_corpo:' style='height: 25px; width: 32px'>",
    ':pacoca_fundo:': "<img src='/img/pacoca-sem-braco-rounded.png' class='emoji' alt=':pacoca_fundo:' data-title=':pacoca_fundo:' style='height: 25px; width: 25px'>",
    ':pacoca_fundo_braco:': "<img src='/img/pacoca-com-braco-rounded.png' class='emoji' alt=':pacoca_fundo_braco:' data-title=':pacoca_fundo_braco:' style='height: 25px; width: 25px'>",
    ':pacoca_cat:': "<img src='/img/nyan-cat.gif' class='emoji' alt=':pacoca_cat:' data-title=':pacoca_cat:' style='margin-right: -14px; height: 20px; width: 40px';>",
    ':pacoca_404:': "<img src='/img/errors/page-not-found.jpg' class='emoji' alt=':pacoca_404:' data-title=':pacoca_404:' style='height: 30px; width: 30px'>",
    ':pacoca_500:': "<img src='/img/errors/pato.png' class='emoji' alt=':pacoca_500:' data-title=':pacoca_500:' style='height: 25px; width: 25px'>",
    ':bochecha:': "<img src='/img/emoji/bochecha.png' class='emoji' alt=':bochecha:' data-title=':bochecha:' style='height: 25px; width: 25px'>",

    ':pacoca_choro:': "<img src='/img/emoji/choro.png' class='emoji' alt=':pacoca_choro:' data-title=':pacoca_choro:' style='height: 30px; width: 30px'>",
    ':pacoca_fome:': "<img src='/img/emoji/fome.png' class='emoji' alt=':pacoca_fome:' data-title=':pacoca_fome:' style='height: 30px; width: 30px'>",
    ':pacoca_raiva:': "<img src='/img/emoji/raiva.png' class='emoji' alt=':pacoca_raiva:' data-title=':pacoca_raiva:' style='height: 30px; width: 30px'>",
    ':pacoca_beijo:': "<img src='/img/emoji/beijo.png' class='emoji' alt=':pacoca_beijo:' data-title=':pacoca_beijo:' style='height: 30px; width: 30px'>",

    ':pacoca_caveira:': "<img src='/img/emoji/caveira.png' class='emoji' alt=':pacoca_caveira:' data-title=':pacoca_caveira:' style='height: 30px; width: 30px'>",
    ':pacoca_palhaco:': "<img src='/img/emoji/palhaco.png' class='emoji' alt=':pacoca_palhaco:' data-title=':pacoca_palhaco:' style='height: 30px; width: 30px'>",
    ':pacoca_oculos:': "<img src='/img/emoji/oculos.png' class='emoji' alt=':pacoca_oculos:' data-title=':pacoca_oculos:' style='height: 30px; width: 30px'>",
    ':pacoca_diabinho:': "<img src='/img/emoji/diabinho.png' class='emoji' alt=':pacoca_diabinho:' data-title=':pacoca_diabinho:' style='height: 30px; width: 30px'>",
    ':pacoca_anjo:': "<img src='/img/emoji/anjo.png' class='emoji' alt=':pacoca_anjo:' data-title=':pacoca_anjo:' style='height: 28px; width: 35px'>",
    ':pacoca_assustado:': "<img src='/img/emoji/assustado.png' class='emoji' alt=':pacoca_assustado:' data-title=':pacoca_assustado:' style='height: 30px;'>",
    ':pacoca_derretendo:': "<img src='/img/emoji/derretendo.png' class='emoji' alt=':pacoca_derretendo:' data-title=':pacoca_derretendo:' style='height: 30px;'>",
};

export function replaceEmojis(text: string) {
    return Object.keys(emojis).reduce((acc, key) => {
        return acc.replace(new RegExp(key, 'g'), emojis[key]);
    }, text);
}

// Função auxiliar para escapar HTML
function escapeHtml(text: string) {
    return text.replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;")
               .replace(/"/g, "&quot;")
               .replace(/'/g, "&#039;");
}

export const calculateTime = (created_at: any) =>{
    const dataPostagem = new Date(created_at).getTime(); // Converte a data da postagem para timestamp
    const dataAtual = Date.now(); // Pega o timestamp atual
    const diferencaSegundos = Math.floor((dataAtual - dataPostagem) / 1000); // Diferença em segundos

    let tempo;

    if (diferencaSegundos < 60) {
        tempo = 'Agora mesmo';
    } else if (diferencaSegundos < 3600) {
        const minutos = Math.floor(diferencaSegundos / 60);
        tempo = `há ${minutos} minuto(s)`;
    } else if (diferencaSegundos < 86400) {
        const horas = Math.floor(diferencaSegundos / 3600);
        tempo = `há ${horas} hora(s)`;
    } else if (diferencaSegundos < 2592000) {
        const dias = Math.floor(diferencaSegundos / 86400);
        if (dias === 1) {
            tempo = 'ontem';
        } else {
            tempo = `há ${dias} dia(s)`;
        }
    } else {
        const data = new Date(dataPostagem);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
        const ano = data.getFullYear();
        tempo = `${dia}/${mes}/${ano}`;
    }

    return tempo;
}


const blacklist = [
    'estrupo',
    'estrupar',
    'estrupa',
    'caralho',
    'bunda',
    'hitler',
    'idiota',
    'bunda',
    'Idiota',
    'Desgraçado',
    'cadela',
    'sangrento',
    'besteira',
    'merda',
    'besteira',
    'filho da puta',
    'chupador de pau',
    'besteira',
    'boceta',
    'cyka blyat',
    'droga',
    'caramba',
    'pau',
    'idiota',
    'sapatona',
    'filho da puta',
    'Porra',
    'Maldito',
    'caramba',
    'inferno',
    'puta merda',
    'merda',
    'na merda',
    'kike',
    'filho da puta',
    'cu',
    'anus',
    'toba',
    'puta',
    'foda',
    'foda-se',
    'foder',
    'pariu',
    'nazista',
    'nazismo',
    'neonazismo',
    'neonazista',
    'odeio negro',
    'hitler',
    'anus',
    'arrombado',
    'asno',
    'babaca',
    'baita',
    'baleia',
    'baitola',
    'besta',
    'besteira',
    'bicha',
    'bichona',
    'bichona velha',
    'biscate',
    'boceta',
    'boiola',
    'bosta',
    'bostinha',
    'boçal',
    'burro',
    'bunda',
    'bundão',
    'bunduda',
    'cabeçudo',
    'cacete',
    'cadela',
    'cafajeste',
    'caga-regras',
    'cagão',
    'canalha',
    'capeta',
    'caralho',
    'caramba',
    'capiroto',
    'chifrudo',
    'chupador de pau',
    'cocô',
    'corno',
    'cretino',
    'crackudo',
    'cretino',
    'cruel',
    'cu',
    'cuzão',
    'cyka blyat',
    'degenerado',
    'demente',
    'débil mental',
    'desgraça',
    'desgraçado',
    'diabo',
    'doente',
    'droga',
    'egocêntrico',
    'escroto',
    'esnobe',
    'estrupa',
    'estrupar',
    'estrupo',
    'estúpido',
    'excremento',
    'fdp',
    'fedorento',
    'feioso',
    'filho da puta',
    'foda',
    'foda-se',
    'foder',
    'fudido',
    'fracassado',
    'frango',
    'frouxo',
    'gentalha',
    'golpista',
    'gordo imundo',
    'idiota',
    'imbecil',
    'imbecilóide',
    'impotente',
    'inútil',
    'inferno',
    'jumento',
    'kike',
    'lazarento',
    'lerdo',
    'lixo humano',
    'macaco',
    'mal amado',
    'mal educado',
    'maldito',
    'maluco',
    'merda',
    'mentecapto',
    'miserável',
    'misógino',
    'mongol',
    'mula',
    'na merda',
    'naba',
    'nazista',
    'nazismo',
    'neonazismo',
    'neonazista',
    'nojento',
    'nóia',
    'odeio negro',
    'ogro',
    'otário',
    'otário de merda',
    'palhaço',
    'paspalho',
    'pilantra',
    'piranha',
    'porra',
    'preto imundo',
    'prostituta',
    'puta',
    'puta merda',
    'puto',
    'quenga',
    'racista',
    'rato',
    'retardado',
    'sangrento',
    'sapatão',
    'sapatona',
    'satanás',
    'safado',
    'safadão',
    'seu lixo',
    'seu merda',
    'tapado',
    'toba',
    'tosco',
    'trouxa',
    'troll',
    'urubu',
    'vaca',
    'vadia',
    'vagabunda',
    'verme',
    'viado',
    'zé ninguém',
    'zé ruela',
    'xvideos',
    'x videos',
    'xxx',
    'cuceta'
];