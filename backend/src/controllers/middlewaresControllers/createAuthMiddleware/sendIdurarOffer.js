const { afterRegistrationSuccess } = require('@/emailTemplate/emailVerfication');

const { Resend } = require('resend');

const sendbrava-salesOffer = async ({ email, name }) => {
  const resend = new Resend(process.env.RESEND_API);

  const { data } = await resend.emails.send({
    from: 'hello@brava-salesapp.com',
    to: email,
    subject: 'Customize brava-sales ERP CRM or build your own SaaS',
    html: afterRegistrationSuccess({ name }),
  });

  return data;
};

module.exports = sendbrava-salesOffer;
