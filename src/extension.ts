import * as vscode from 'vscode';
// 调用接口数据
import axios from 'axios';
// 解析xml数据
const xmlParser = require('fast-xml-parser')

async function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "wds-search-blog-examples" is now active!');
	const res = await axios.get("https://blog.csdn.net/qq_35812380/rss/list?spm=1001.2014.3001.5494")
	// 在DEBUG CONSOLE 面板中查看输出
	const articles = xmlParser.parse(res.data).rss.channel.item.map((article: { title: any; description: any; link: any; }) => {
		return {
			label: article.title,
			detail: article.description,
			link: article.link
		}
	})

	console.log(articles);

	let disposable = vscode.commands.registerCommand('exts.searchWds', async () => {
		// 1. 打开搜索框
		const article = await vscode.window.showQuickPick(articles, {
			matchOnDetail: true,
		})

		// 2. 打开一个新窗口
		if (article == null) return;

		// @ts-ignore
		vscode.env.openExternal(article.link);

		console.log(article);



	});

	context.subscriptions.push(disposable);
}

function deactivate() { }

export {
	activate,
	deactivate
}