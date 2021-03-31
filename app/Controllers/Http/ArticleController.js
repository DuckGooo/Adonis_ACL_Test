'use strict';
const Article = use('App/Models/Article');

class ArticleController {
  /**
   * @swagger
   * /articles:
   *   post:
   *     tags:
   *       - Articles
   *     summary: 게시글 작성
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: title
   *         description: 제목
   *         in: formData
   *         required: false
   *         type: string
   *       - name: content
   *         description: 내용
   *         in: formData
   *         required: false
   *         type: string
   *     responses:
   *       200:
   *         description: Send hello message
   *         example:
   *           message: Hello Guess
   */
  async create({ request, response }) {
    const params = request.all();

    try {
      const article = await Article.create(params);

      return await Article.find(article.id);
    } catch (e) {
      response.status(400).send({ message: e.message });
    }
  }
}

module.exports = ArticleController;
