//dto - data transfet object, создаем payload токена

module.exports = class UserDto {
    email;
    id;
    isActivated;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.tg_nickname = model.tg_nickname
    }

}