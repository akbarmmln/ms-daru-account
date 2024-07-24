'use strict';

const rsmg = require('../../../response/rs');
const utils = require('../../../utils/utils');
const moment = require('moment');
const uuidv4 = require('uuid').v4;
const logger = require('../../../config/logger');
const mailer = require('../../../config/mailer');
const adrAccountModel = require('../../../model/adr_account');
const bcrypt = require('bcryptjs');
const saltRounds = 12;
const connectionDB = require('../../../config/db').Sequelize;

exports.chekAccount = async function(req, res){
  try{
    let id = req.params.id;
    const splitId = id.split('-');
    const splitIdLenght = splitId.length
    const partition = splitId[splitIdLenght - 1]

    const tabelAccount = adrAccountModel(partition)

    const data = await tabelAccount.findOne({
      raw: true,
      where: {
        id: id
      }
    })

    if (!data) {
      return res.status(200).json(rsmg('000000', false))
    } else {
      return res.status(200).json(rsmg('000000', true))
    }
  }catch(e){
    logger.error('error GET /api/v1/account/:id...', e);
    return utils.returnErrorFunction(res, 'error GET /api/v1/account/:id...', e);
  }
}

exports.getAccount = async function (req, res) {
  try {
    let id = req.id;
    const splitId = id.split('-');
    const splitIdLenght = splitId.length
    const partition = splitId[splitIdLenght - 1]

    const tabelAccount = adrAccountModel(partition)

    const dataAccount = await tabelAccount.findOne({
      raw: true,
      where: {
        id: id
      }
    })
    if (!dataAccount) {
      return res.status(200).json(rsmg('10005', null));
    }

    return res.status(200).json(rsmg('000000', dataAccount));
  } catch (e) {
    logger.error('error GET /api/v1/account...', e);
    return utils.returnErrorFunction(res, 'error GET /api/v1/account...', e);
  }
}

exports.createAccount = async function(req, res){
  try{
    const partition = req.body.partition;
    const dateTime = req.body.dateTime;
    const id = req.body.id;
    const nama = req.body.nama;
    const kk = req.body.kk
    const mobile_number = req.body.mobile_number;
    const email = req.body.email;
    const alamat = req.body.alamat;
    const blok = req.body.blok;
    const nomor_rumah = req.body.nomor_rumah;
    const rt = req.body.rt;
    const rw = req.body.rw;

    const tabelAccount = adrAccountModel(partition)
    const accountCreated = await tabelAccount.create({
      id: id,
      created_dt: dateTime,
      created_by: id,
      modified_dt: null,
      modified_by: null,
      is_deleted: 0,
      nama: nama,
      kk: kk,
      mobile_number: mobile_number,
      email: email,
      alamat: alamat,
      blok: blok,
      nomor_rumah: nomor_rumah,
      rt: rt,
      rw: rw
    })

    return res.status(200).json(rsmg('000000', accountCreated));
  }catch(e){
    logger.error('error POST /api/v1/account/create-account...', e);
    return utils.returnErrorFunction(res, 'error POST /api/v1/account/create-account...', e);
  }
}