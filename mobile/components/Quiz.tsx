import React, { useState } from 'react';
import { VStack, Text, Button, Box, Heading, Radio, ScrollView, Progress, HStack, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { QuizQuestion } from '@/services/courseService';

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
  onCancel: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, onComplete, onCancel }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleNext = () => {
    if (selectedOption === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (showResult) {
    const finalScore = (score / questions.length) * 100;
    return (
      <VStack space={6} p={6} alignItems="center" justifyContent="center" flex={1}>
        <Icon as={<MaterialIcons name="emoji-events" />} size={20} color="amber.400" />
        <Heading size="lg" textAlign="center">Quiz Finalizado!</Heading>
        <Text fontSize="xl" textAlign="center">
          Você acertou {score} de {questions.length} questões.
        </Text>
        <Box w="full" bg="coolGray.100" p={4} rounded="xl" alignItems="center">
          <Text fontSize="2xl" fontWeight="bold" color="amber.600">{finalScore.toFixed(0)}%</Text>
          <Text color="coolGray.500">Sua pontuação</Text>
        </Box>
        <Button onPress={() => onComplete(finalScore)} w="full" size="lg" colorScheme="amber">
          Voltar para o Curso
        </Button>
      </VStack>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <ScrollView flex={1}>
      <VStack space={6} p={6}>
        <HStack justifyContent="space-between" alignItems="center">
          <Heading size="md">Questão {currentQuestionIndex + 1}/{questions.length}</Heading>
          <Button variant="ghost" onPress={onCancel} p={0}>
            <Icon as={<MaterialIcons name="close" />} size={6} color="coolGray.400" />
          </Button>
        </HStack>
        
        <Progress value={progress} size="xs" colorScheme="amber" />

        <Box bg="white" p={6} rounded="2xl" shadow={2}>
          <Text fontSize="lg" fontWeight="medium" mb={4}>
            {currentQuestion.question}
          </Text>

          <Radio.Group
            name="quizOptions"
            value={selectedOption?.toString() || ''}
            onChange={(val) => setSelectedOption(parseInt(val))}
          >
            <VStack space={4}>
              {currentQuestion.options.map((option, index) => (
                <Box 
                  key={index}
                  borderWidth={1} 
                  borderColor={selectedOption === index ? 'amber.400' : 'coolGray.200'}
                  bg={selectedOption === index ? 'amber.50' : 'transparent'}
                  rounded="lg"
                  p={3}
                >
                  <Radio value={index.toString()} colorScheme="amber" my={1}>
                    <Text ml={2}>{option}</Text>
                  </Radio>
                </Box>
              ))}
            </VStack>
          </Radio.Group>
        </Box>

        <Button 
          onPress={handleNext} 
          isDisabled={selectedOption === null}
          size="lg"
          colorScheme="amber"
          rounded="full"
        >
          {currentQuestionIndex < questions.length - 1 ? 'Próxima Questão' : 'Finalizar Quiz'}
        </Button>
      </VStack>
    </ScrollView>
  );
};
