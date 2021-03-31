"use strict";

class TestController {



  /**
   * @swagger
   * /posts:
   *   post:
   *     tags:
   *       - Test
   *     summary: Create
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
  async hello({ request, response }) {
    const name = request.input("title", "예시 제목입니다.");
    const content = request.input("content", "예시 내용입니다.");

    // response.send({ message: "Hello " + name });
    return 'ok'
  }


}

module.exports = TestController;
