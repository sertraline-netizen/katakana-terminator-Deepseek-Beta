// ==UserScript==
// @name        Katakana Terminator (DeepSeek Version) bata
// @description Convert gairaigo (Japanese loan words) back to English via DeepSeek API
// @author      sertraline-netizen
// @homepageURL https://github.com/sertraline-netizen/katakana-terminator-Deepseek-Beta
// @Reference   Arnie97 (https://github.com/Arnie97)
// @license     MIT
// @copyright   2026, Katakana Terminator (DeepSeek Version) bata (https://github.com/sertraline-netizen/katakana-terminator-Deepseek-Beta/graphs/contributors)
// @namespace   https://github.com/sertraline-netizen
// @match       *://*/*
// @exclude     *://*.bilibili.com/video/*
// @grant       GM.xmlHttpRequest
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @connect     api.deepseek.com
// @version     2026.04.08.mod
// @name:ja-JP  カタカナ‌ターミネーター ディープシーク（ベータ）
// @name:zh-CN  片假名终结者 (DeepSeek版bata)
// @description:zh-CN 在网页中的日语外来语上方标注英文原词
// ==/UserScript==

// ======================================================================
// 【必填】请在此处填入你的 DeepSeek API 密钥
// ======================================================================
var DEEPSEEK_API_KEY = ""; 
// ======================================================================

var _ = document;
var queue = {};  // [cite: 4]
var cachedTranslations = {}; 
var newNodes = [_.body];

// 递归遍历节点 [cite: 5]
function scanTextNodes(node) {
    if (!node.parentNode || !_.body.contains(node)) { // [cite: 6]
        return;
    }
    var excludeTags = {ruby: true, script: true, select: true, textarea: true};
    switch (node.nodeType) { // [cite: 7]
    case Node.ELEMENT_NODE:
        if (node.tagName.toLowerCase() in excludeTags || node.isContentEditable) { // [cite: 8]
            return;
        }
        return node.childNodes.forEach(scanTextNodes); // [cite: 9]
    case Node.TEXT_NODE:
        while ((node = addRuby(node))); // [cite: 10]
    }
}

// 添加 ruby 标签 [cite: 11]
function addRuby(node) {
    var katakana = /[\u30A1-\u30FA\u30FD-\u30FF][\u3099\u309A\u30A1-\u30FF]*[\u3099\u309A\u30A1-\u30FA\u30FC-\u30FF]|[\uFF66-\uFF6F\uFF71-\uFF9D][\uFF65-\uFF9F]*[\uFF66-\uFF9F]/, match;
    if (!node.nodeValue || !(match = katakana.exec(node.nodeValue))) { // [cite: 12]
        return false;
    }
    var ruby = _.createElement('ruby');
    ruby.appendChild(_.createTextNode(match[0]));
    var rt = _.createElement('rt');
    rt.classList.add('katakana-terminator-rt');
    ruby.appendChild(rt);

    queue[match[0]] = queue[match[0]] || []; // [cite: 13]
    queue[match[0]].push(rt);

    var after = node.splitText(match.index);
    node.parentNode.insertBefore(ruby, after);
    after.nodeValue = after.nodeValue.substring(match[0].length);
    return after; // [cite: 14]
}

function translateTextNodes() {
    var apiRequestCount = 0; // [cite: 15]
    var phraseCount = 0;
    var chunkSize = 50; // DeepSeek 建议单次处理数量不宜过大以保持 JSON 稳定性
    var chunk = [];

    for (var phrase in queue) { // [cite: 16]
        phraseCount++;
        if (phrase in cachedTranslations) { // [cite: 17]
            updateRubyByCachedTranslations(phrase);
            continue;
        }
        chunk.push(phrase);
        if (chunk.length >= chunkSize) {
            apiRequestCount++;
            deepseekTranslate(chunk); // [cite: 19]
            chunk = [];
        }
    }
    if (chunk.length) {
        apiRequestCount++;
        deepseekTranslate(chunk); // [cite: 20]
    }
}

// DeepSeek API 核心函数
function deepseekTranslate(phrases) {
    phrases.forEach(function(phrase) {
        cachedTranslations[phrase] = null;
    });

    var api = 'https://api.deepseek.com/v1/chat/completions';
    
    // 构建 Prompt [cite: 23, 24]
    var prompt = "You are a Japanese-English translator. Translate the following Japanese Katakana list into English. Return ONLY a JSON object where keys are original words and values are English translations. \nList: " + JSON.stringify(phrases);

    GM_xmlhttpRequest({
        method: "POST", // 
        url: api,
        headers: {
            "Authorization": "Bearer " + DEEPSEEK_API_KEY,
            "Content-Type": "application/json"
        },
        data: JSON.stringify({
            "model": "deepseek-chat",
            "messages": [
                {"role": "system", "content": "You are a helpful assistant that translates Katakana to English. Output JSON only."},
                {"role": "user", "content": prompt}
            ],
            "response_format": { "type": "json_object" }
        }),
        onload: function(dom) {
            try { // [cite: 25]
                var jsonResp = JSON.parse(dom.responseText);
                var content = jsonResp.choices[0].message.content; // [cite: 27]
                var translations = JSON.parse(content);
                
                for (var original in translations) {
                    var translated = translations[original].replace(/\s+$/, ''); // [cite: 27]
                    cachedTranslations[original] = translated;
                    updateRubyByCachedTranslations(original); // [cite: 28]
                }
            } catch (err) {
                console.error('Katakana Terminator DeepSeek Error:', err, dom.responseText); // [cite: 29]
            }
        },
        onerror: function(dom) {
            console.error('Katakana Terminator request error', dom.statusText); // [cite: 30]
        },
    });
}

function updateRubyByCachedTranslations(phrase) {
    if (!cachedTranslations[phrase]) { // [cite: 31]
        return;
    }
    (queue[phrase] || []).forEach(function(node) {
        node.dataset.rt = cachedTranslations[phrase];
    });
    delete queue[phrase]; // [cite: 32]
}

function mutationHandler(mutationList) {
    mutationList.forEach(function(mutationRecord) {
        mutationRecord.addedNodes.forEach(function(node) {
            newNodes.push(node);
        });
    });
}

function main() {
    GM_addStyle("rt.katakana-terminator-rt::before { content: attr(data-rt); }");
    var observer = new MutationObserver(mutationHandler);
    observer.observe(_.body, {childList: true, subtree: true}); // [cite: 34]

    function rescanTextNodes() {
        mutationHandler(observer.takeRecords());
        if (!newNodes.length) { // [cite: 35]
            return;
        }
        newNodes.forEach(scanTextNodes);
        newNodes.length = 0; // [cite: 37]
        translateTextNodes();
    }
    rescanTextNodes();
    setInterval(rescanTextNodes, 500); // [cite: 38]
}

// Polyfills [cite: 39, 42, 44]
if (typeof GM_xmlhttpRequest === 'undefined' && typeof GM === 'object' && typeof GM.xmlHttpRequest === 'function') {
    GM_xmlhttpRequest = GM.xmlHttpRequest;
}
if (typeof GM_addStyle === 'undefined') {
    GM_addStyle = function(css) {
        var head = _.getElementsByTagName('head')[0];
        if (!head) return null;
        var style = _.createElement('style');
        style.setAttribute('type', 'text/css');
        style.textContent = css;
        head.appendChild(style);
        return style;
    };
}
if (typeof NodeList.prototype.forEach === 'undefined') {
    NodeList.prototype.forEach = function(callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

main();
