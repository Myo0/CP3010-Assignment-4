const db = require('../db/queries');

const getIndex = async (req, res) => {
  try {
    const messages = await db.getAllMessages();
    res.render('index', { messages });
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
};

const getNewMessage = (req, res) => {
  if (!req.user) return res.redirect('/log-in');
  res.render('new-message', { errors: [] });
};

const postNewMessage = async (req, res) => {
  if (!req.user) return res.redirect('/log-in');

  const { title, text } = req.body;

  if (!title || !text) {
    return res.render('new-message', {
      errors: [{ msg: 'Both title and message are required' }],
    });
  }

  try {
    await db.createMessage(title, text, req.user.id);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
};

const postDeleteMessage = async (req, res) => {
  if (!req.user || !req.user.is_admin) return res.redirect('/');
  try {
    await db.deleteMessage(req.params.id);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
};

const getJoin = (req, res) => {
  if (!req.user) return res.redirect('/log-in');
  res.render('join', { errors: [] });
};

const postJoin = async (req, res) => {
  if (!req.user) return res.redirect('/log-in');

  const { passcode } = req.body;

  try {
    if (passcode === process.env.ADMIN_PASSCODE) {
      await db.setAdmin(req.user.id);
      return res.redirect('/');
    } else if (passcode === process.env.MEMBER_PASSCODE) {
      await db.setMember(req.user.id);
      return res.redirect('/');
    } else {
      return res.render('join', {
        errors: [{ msg: 'Wrong passcode, try again.' }],
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
};

module.exports = {
  getIndex,
  getNewMessage,
  postNewMessage,
  postDeleteMessage,
  getJoin,
  postJoin,
};
