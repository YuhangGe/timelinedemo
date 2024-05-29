# Timeline Editor

## Develop

```bash
pnpm i
pnpm dev
```

## Features

完成以下功能：

* 编辑器整体布局，左边栏加载素材，底部为 Timeline，中部为选中 Clip 的信息展示和预览框。
* 纯前端实现视频帧的图片提取，可以真实渲染 Clip。
* Clip 可拖拽调整开始和结束的时间（扩展和压缩），调整后的信息在预览框及时可见，并可以播放。
* 从素材栏拖拽到 Timeline 增加新 Track，以及该素材的新 Clip。
* 从素材栏拖拽到 Timeline 的某个 Track，增加该素材的新 Clip。
* 在单个 Track 中拖拽，调整 Clip 在整体时间轴的位置。
* 从某个 Track 中拖拽 Clip 到另一个 Track 中。
* 从某个 Track 中拖拽 Clip 到顶部、底部或两个 Track 之间的空白，在对应位置新增 Track。

缺陷：

* 纯 Demo，如果产品化，还有很多细节需要完善。
* 受限于时间，以及出于知识产权的考量，故意没有写注释，并且不少变量名是瞎取的。
* 受限于时间，以及出于知识产权的考量，个别 bug 发现了也未能解决。

抱歉因为之前经历过一些被白嫖的情况，所以稍微留了点心故意没做完美（当然也有时间和个人能力因素），还望理解！如果是正式做一个项目，代码质量、注释等都应该是严格要求的。

## Screenshot

<p align='center'>
  <img src="https://github.com/YuhangGe/timeline-demo/blob/main/screenshots/kk.gif?raw=true" />
</p>
