import React, { useCallback, useRef } from 'react';

import {
  FiArrowLeft, FiUser, FiClock,
} from 'react-icons/fi';
import { CgCalendarDates } from 'react-icons/cg';
import { MdSubject } from 'react-icons/md';
import { SiCoursera } from 'react-icons/si';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/AuthContext';
import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/input';
import Button from '../../components/button';

import { Container, Content, Background } from './styles';

interface CadastrarInFormData {
    disciplina: string;
    professor: string
    dia_semana: string;
    periodo: string
    horario: string;
}

const Dashboard: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { cadastrar } = useAuth();

  const handleSubmit = useCallback(async (data: CadastrarInFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        disciplina: Yup.string().required('Nome Obrigatório'),
        professor: Yup.string().required('Nome Obrigatório'),
        dia_semana: Yup.string().required('Nome Obrigatório'),
        periodo: Yup.string().required('Nome Obrigatório'),
        horario: Yup.string().required('Nome Obrigatório'),

      });

      await schema.validate(data, {
        abortEarly: false,
      });
      await cadastrar({
        disciplina: data.disciplina,
        professor: data.professor,
        dia_semana: data.dia_semana,
        periodo: data.periodo,
        horario: data.horario,
      });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);
        formRef.current?.setErrors(errors);
      }
    }
  }, [cadastrar]);
  return (
    <Container>
      <Content>
        <img src={logoImg} alt="GoBarber" />
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Faça o cadastro do professor</h1>

          <Input name="disciplina" icon={MdSubject} placeholder="Disciplina" />
          <Input name="professor" icon={FiUser} placeholder="Professor" />
          <Input name="dia_semana" icon={CgCalendarDates} placeholder="Dia da Semana" />
          <Input name="periodo" icon={SiCoursera} placeholder="Período" />
          <Input name="horario" icon={FiClock} type="data" placeholder="Horário" />
          <Button type="submit">Cadastrar</Button>
        </Form>
        <Link to="/" />
      </Content>
      <Background />
    </Container>
  );
};

export default Dashboard;
