import { Title, Grid, Card } from "@mantine/core";
import { Fragment } from "react/jsx-runtime";
import { Button, Checkbox, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

interface LoginRegisterPageProps {
  csrfToken: string;
};

const LoginRegisterPage = ({ csrfToken }: LoginRegisterPageProps) => {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      termsOfService: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });
  
  return (
    <Fragment>
      <Title mb={16} className="text-yellow-400">Login or Register</Title>

      <Grid justify="center" align="top" columns={2}>
        <Grid.Col span={{ xs: 2, md: 1 }} mih="300px">
          <Card style={{ height: '100%' }}>
            {/* Login form or content goes here */}
            <p>
              Already have an account? Welcome back!
              Please log in below.
            </p>

            <form method="post" action="/account-login/">
              <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
              <Group>
                <TextInput
                  withAsterisk
                  name="username"
                  label="Username"
                  placeholder="YourUsername"
                  key={form.key('username')}
                  {...form.getInputProps('username')}
                />

                <TextInput
                  withAsterisk
                  label="Password"
                  name="password"
                  placeholder="Your password"
                  type="password"
                  key={form.key('password')}
                  {...form.getInputProps('password')}
                />
              </Group>

              <Group justify="flex-end" mt="md" className="absolute bottom-[1rem] right-[1rem]">
                <Button type="submit">Log Me In</Button>
              </Group>
            </form>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ xs: 2, md: 1 }} mih="400px">
          <Card style={{ height: '100%' }}>
            {/* Register form or content goes here */}
            <p>Hi there!</p>
            {/* <form onSubmit={form.onSubmit((values) => console.log(values))}> */}
            <form method="post" action="/register/">
              <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
              <Grid>
                <Grid.Col span={{ xs: 12, md: 6, lg: 4 }}>
                  <TextInput
                    name="email"
                    withAsterisk
                    label="Email"
                    placeholder="your@email.com"
                    key={form.key('email')}
                    {...form.getInputProps('email')}
                  />
                </Grid.Col>

                <Grid.Col span={{ xs: 12, md: 6, lg: 8 }}>
                  <Group>
                    <TextInput
                      name="first_name"
                      withAsterisk
                      label="First Name"
                      placeholder="Your first name"
                      key={form.key('firstName')}
                      {...form.getInputProps('firstName')}
                    />

                    <TextInput
                      name="last_name"
                      withAsterisk
                      label="Last Name"
                      placeholder="Your last name"
                      key={form.key('lastName')}
                      {...form.getInputProps('lastName')}
                    />

                    <TextInput
                      name="display_name"
                      withAsterisk
                      label="Display Name"
                      placeholder="Your display name"
                      key={form.key('displayName')}
                      {...form.getInputProps('displayName')}
                    />
                  </Group>
                </Grid.Col>

                <Grid.Col span={12}>
                  <TextInput
                    name="password"
                    withAsterisk
                    label="Password"
                    placeholder="Your password"
                    type="password"
                    key={form.key('password')}
                    {...form.getInputProps('password')}
                  />
                </Grid.Col>
              </Grid>

              <Checkbox
                mt="md"
                label={<>I agree to the <a href="/terms-of-service" className="underline">Terms of Service</a>.</>}
                key={form.key('termsOfService')}
                {...form.getInputProps('termsOfService', { type: 'checkbox' })}
              />

              <Group justify="flex-end" mt="md" className="absolute bottom-[1rem] right-[1rem]">
                <Button type="submit">Create Account</Button>
              </Group>
            </form>            
          </Card>
        </Grid.Col>
      </Grid>
    </Fragment>
  );
};

export default LoginRegisterPage;