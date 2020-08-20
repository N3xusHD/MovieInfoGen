# 电影信息查询脚本

## :book: 介绍 Introduction

本脚本用于在豆瓣电影页面（如：[肖申克的救赎 (豆瓣)](https://movie.douban.com/subject/1292052/)）获取电影信息，多用于各大 PT 站点发布种子填写介绍。与主流格式（PT-Gen）基本一致。

## :balloon: 特性 Features

- 纯前端处理，无托管服务器，本获取信息服务无访问次数限制；

- 使用 [IMDb 官方插件接口](https://www.imdb.com/plugins)（支持 JSONP 跨域获取，虽然用户脚本可以不考虑跨域问题）获取评分，相比于 OMDb，无需 API Key，分数获取迅速，更新及时（1次/24h）；
  
  `https://p.media-imdb.com/static-content/documents/v1/title/tt${ID}/ratings%3Fjsonp=imdb.rating.run:imdb.api.title.ratings/data.json`

- 考虑到豆瓣的 API 极其不稳定并有下线的可能性，本脚本尽量避免了对豆瓣 API 的调用，以避免对其过多的依赖；

  最新情况：[豆瓣 API 疑似彻底下线](https://v2ex.com/t/699393)，所有已知的公开 API Key 均报错：`code: 109, msg: "invalid_credencial2"`

- 部分豆瓣条目需用户登录后才能访问，登录豆瓣账户后使用本脚本即可获取相应条目信息；

- 丰富了演职员列表信息，包括饰演、配音数据，皆从豆瓣爬取；

- 自动获取时光网对应电影条目的**幕后揭秘**信息。

## :dart: 待办 TODOs

- [ ] 主要进行一些维护工作，新功能视情况增加。

## :roller_coaster: 演示 Demo

![demo1](https://raw.githubusercontent.com/Sec-ant/MovieInfoGen/master/assets/demo/gif/demo1.gif)

## :hammer_and_wrench: 安装 Installation

请到 [Greasy Fork](https://greasyfork.org/zh-CN/scripts/38878-%E7%94%B5%E5%BD%B1%E4%BF%A1%E6%81%AF%E6%9F%A5%E8%AF%A2%E8%84%9A%E6%9C%AC) 页面，配合 [Tampermonkey](https://www.tampermonkey.net/) 浏览器扩展安装使用。

## :building_construction: 贡献 Contribution

本脚本暂时不开放多人编辑权限，如有问题和想法请先到 [Greasy Fork 反馈页面](https://greasyfork.org/zh-CN/scripts/38878-%E7%94%B5%E5%BD%B1%E4%BF%A1%E6%81%AF%E6%9F%A5%E8%AF%A2%E8%84%9A%E6%9C%AC/feedback)或 [Github Issues 页面](https://github.com/Sec-ant/MovieInfoGen/issues)提交。

## :copyright: 许可 License

[GNU General Public License v3.0 or later](https://spdx.org/licenses/GPL-3.0-or-later.html)

## :mailbox: 邮箱 Email

zzwu@zju.edu.cn

## :heart: 捐赠 Donation

<table><tbody><tr><td>支付宝 Alipay</td><td>微信 Wechat</td></tr>
<tr><td><img width="200" src="https://i.loli.net/2020/02/28/JPGgHc3UMwXedhv.jpg"></td><td><img width="200" src="https://i.loli.net/2020/03/02/qDQ9Xk8uCHwcaLZ.png"></td></tr></tbody></table>
