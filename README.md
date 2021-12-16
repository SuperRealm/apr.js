# apr.js--基于apr-fe的前台插件
1.webpack以及webpack-cli安装配置
2.package.json安装插件
3.本地调试npx webpack --config .\webpack.config.js
4.测试商店信息

shopId:58133283022
productId:6676004045006

测试商店登录流程：

https://www.shopify.com/partners

账号：waynechen@okaysou.com

密码：chenwei765966

5.安装商店

rossvilo.com

https://www.topfinel.com/collections/curtains/products/top-finel-floral-sheer-curtains-2-panels

https://dunhai-2.myshopify.com/

https://cherishpod.com/

cherishinbox.com

https://www.blackpinkboutique.com/

https://www.susteas.com/products/retro-electric-kettle-1-8l-white

6.1.shopify插入代码展示星级与评论区内容
1.1产品列表页：搜索product，找到snippets列表下面的product-card-grid.liquid文件，ctrl+f全文搜索product-card__title，找到对应位置插入

```html
<div data-product-id={{ product.id }} id="atomeeStarRating"></div>
```

save保存查看效果
1.2产品详情页：
1.2.1如果有

```html
<h1 class="product-single__title">{{ product.title }}</h1>
```

则星级正常展示在该标签后面
1.2.2如需插入其他位置，则在产品页面按f12键，按ctrl+shift+c鼠标移到需要插入的位置并点击，找到对应的class里面的内容，在shopify后台列表搜索product，找到templates下的product.liquid文件，找到section标签或snippets后的内容，分别进去ctrl+f全文搜索从产品详情页的class，在后面插入

```html
<div id="atomeeStarRating"></div>
```

保存之后在产品页面查看效果
2.评论内容展示
2.1产品详情页正常展示
2.2产品详情页无法正常显示
2.2.1搜索product-template.liquid文件，在文档末尾添加

```html
<div id="atomeeReviewsContent"></div>
```

2.2.2如需插入任意位置，则在theme.liquid文件中找到对应位置添加

```html
<div id="atomeeReviewsContent"></div>
```

3.可通过xpath插入

