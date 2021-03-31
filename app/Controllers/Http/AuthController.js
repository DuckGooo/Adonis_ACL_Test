'use strict';
const { validate } = use('Validator');
const User = use('App/Models/User');
const Role = use('Adonis/Acl/Role');
const Permission = use('Adonis/Acl/Permission');
const Hash = use('Hash');

class AuthController {
  /**
   * @swagger
   * /sign-up:
   *   post:
   *     tags:
   *       - Auth
   *     summary: 회원가입
   *     parameters:
   *       - name: email
   *         description: 이메일
   *         in: formData
   *         required: false
   *         type: string
   *       - name: name
   *         description: 이름
   *         in: formData
   *         required: false
   *         type: string
   *       - name: "password"
   *         in: "formData"
   *         description: "비밀번호"
   *         required: true
   *         type: "string"
   *       - name: "password_confirmation"
   *         in: "formData"
   *         description: "비밀번호 확인"
   *         required: true
   *         type: "string"
   *     responses:
   *       200:
   *         description: Send hello message
   *         example:
   *           message: Hello Guess
   */
  async signUp({ request, response }) {
    const params = request.all();
    // 유효성 검증
    const rules = {
      email: 'required|email|unique:users,email',
      password: 'required|confirmed',
      name: 'required',
    };
    const validation = await validate(params, rules);
    if (validation.fails()) {
      return response.status(422).send(validation.messages()[0]);
    }

    delete params.password_confirmation;

    const user = await User.create(params);
    const role = await Role.query().where({ slug: 'user' }).first();
    const permission = await Permission.query().where({ slug: 'read_users' }).first();

    await user.roles().attach([role.id]);
    await user.permissions().attach([permission.id]);

    return { user, role: await user.getRoles(), permission: await user.permissions().fetch() };
  }

  /**
   * @swagger
   * /sign-in:
   *   post:
   *     tags:
   *       - Auth
   *     summary: 로그인
   *     parameters:
   *       - name: email
   *         description: 이메일
   *         in: formData
   *         required: false
   *         type: string
   *       - name: "password"
   *         in: "formData"
   *         description: "비밀번호"
   *         required: true
   *         type: "string"
   *     responses:
   *       200:
   *         description: Send hello message
   *         example:
   *           message: Hello Guess
   */
  async signIn({ request, response, auth }) {
    let params = request.all();

    // 유효성 검증
    const rules = {
      email: 'required|email',
      password: 'required',
    };
    try {
      const validation = await validate(params, rules);
      if (validation.fails()) {
        return response.status(422).json(validation.messages());
      }
      let { email, password } = params;

      const exist = await User.query().where({ email, deleted_at: null }).first();
      if (!exist) {
        return response.status(400).send({ message: '아이디 또는 비밀번호를 확인하세요.' });
      }

      const isSame = await Hash.verify(password, exist.password);
      if (isSame) {
        return {
          user: exist,
          token: await auth.generate(exist),
        };
      }
    } catch (e) {
      response.status(400).send({ message: e.message });
    }
  }
}

module.exports = AuthController;
