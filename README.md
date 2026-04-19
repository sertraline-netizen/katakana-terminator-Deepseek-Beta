### Katakana Terminator Deepseek (beta) 
### 片假名终结者deepseek版 beta 
### カタカナ‌ターミネーター ディープシーク（ベータ）

#### In a nutshell 简介
This is an improved version of a [katakana-terminator](https://github.com/Arnie97/katakana-terminator) browser extension plugin developed based on [Arnie97](https://github.com/Arnie97/katakana-terminator/commits?author=Arnie97), proposed due to the current unavailability of Google Translate in mainland China (as of 2026). This plugin replaces the Google API with the Deepseek API, marking the original English words above Japanese loanwords on web pages.

这是一个基于[Arnie97](https://github.com/Arnie97/katakana-terminator/commits?author=Arnie97)开发的[katakana-terminator](https://github.com/Arnie97/katakana-terminator)浏览器扩展插件因Google Translate现阶段（2026年）无法于中国大陆地区使用而提出的改进版本。本插件将Google API更改为Deepseek API,在网页中的日语外来语上方标注英文原词。

#### Installation 安装
Please follow the [installation instructions](https://greasyfork.org/en) to configure your browser,
键，然后 [click here to get the user script](https://github.com/sertraline-netizen/katakana-terminator-Deepseek-Beta/raw/master/Katakana-Terminator-(DeepSeek-Version).user.js).

请先阅读教程，在浏览器中安装一个[用户脚本管理器](https://greasyfork.org/en)。之后[戳这里下载并安装本程序](https://github.com/sertraline-netizen/katakana-terminator-Deepseek-Beta/raw/master/katakana-terminator-Deepseek-Beta.js)。

#### Limits 已知缺陷
Gairaigo from other source languages is also converted to English.
Sometimes, certain katakana characters cannot be correctly translated into English. Katakana in certain locations cannot be translated either (such as the video titles at the top when watching videos on some video websites).
You need to manually obtain your Deepseeek Open Platform API and enter it in the corresponding code location before it can be used. For specific steps, please refer to the “How to get Deepseek API” tutorial or read the README document.

即便一组片假名并非源于英语，也会标注为英语中的对应词汇。

有些时候部分片假名无法被正确翻译成英语。部分位置的片假名亦无法被翻译（如某些视频网站观看视频时上方的视频标题）

需要手动获取您的deepseeek开放平台API并输入代码对应位置后方可使用。具体步骤请阅读下方API获取教程或阅读README文档。

#### 如何获取您的deepseek API？
This script does not contain any local AI models; all processing is done through domestic large models via the internet, so it requires token consumption (the billing unit of the AI model). 

To use an analogy, this script is like a mobile phone. If you want to make calls with it, you need to insert a China Unicom or China Mobile SIM card, and the call cost is entirely related to the duration of your calls, which you pay directly to the carrier. Below, I will explain how to register a 'SIM card.'

Currently, the script only supports the Deepseek model. To use this software for chatting normally, you need to:
1. Log in to the [Deepseek Open Platform](https://platform.deepseek.com/usage) page (note, not the chat page).
2. After registering and logging in, recharge your account. The minimum is 10 yuan; this script consumes very little, so 10 yuan will last a long time.
3. On the API keys page, create and copy your key (it starts with sk-).
4. Go into the code, and in the line var DEEPSEEK_API_KEY = "";, input your key within the quotation marks and click save. After that, you can use it normally.

本脚本不包含任何本地AI模型，都是联网使用国内大模型进行处理，所以需要消耗token(AI模型的计费单位）
用比喻来说就是，我做的是一款手机，如果你想用它进行通话，你需要插入联动或者移动的卡，然后通话费用完全和你自己通话时长有关系，直接在运营商那里缴费就可以了，下面，我来说明如何去注册“电话卡”。
目前脚本暂时只支持deepseek模型，要想正常使用此软件进行聊天，需要：

1.登录[Deepseek开放平台](https://platform.deepseek.com/usage)页面（注意不是聊天页面）；

2.注册登录后，进行充值。最低10元，这个脚本耗费很少，10块钱够用很久了；

3.在APIkeys页面，创建并复制key (是sk-的那一串)；

4. 进入代码，在代码var DEEPSEEK_API_KEY = "";这行的双引号中输入你的key，点击保存，即可正常使用。

#### Thanks 致谢
Developed based on the [Deepseek Open Platform](https://platform.deepseek.com/usage) and the original version by [Arnie97](https://github.com/Arnie97/katakana-terminator/commits?author=Arnie97).

基于[Deepseek开放平台](https://platform.deepseek.com/usage)和[Arnie97](https://github.com/Arnie97/katakana-terminator/commits?author=Arnie97)的原始版本开发。

#### Feedback 反馈
This version is a rough draft, originally created to address the author's reluctance to use the original plugin with VPN each time. If you have any suggestions for code improvements, please leave a comment in the GitHub Issues.

该版本为粗略版本，诞生之初是为了解决作者不想每次用魔法使用原始插件的问题。如有代码改进建议请在GitHub Issues中留言。
